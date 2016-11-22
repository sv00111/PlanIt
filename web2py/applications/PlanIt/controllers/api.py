import random
import json
import time
import urllib
import urllib2

api_key = 'AIzaSyBxR53fN_ZDwYgoJ31tYUcAc-riycqih-w'

def get_place_icons(places):
    url = 'https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=' + places + '&key=' + api_key
    return url

import json

def get_more_info(place_id):
    query_url = 'https://maps.googleapis.com/maps/api/place/details/json?placeid=' + place_id + '&key=' + api_key
    results = json.loads(urllib.urlopen(query_url).read())
    return (results)

def get_recommendations():
    ID_counter = int(request.vars.lengthOfArr)
    if auth.user:
        logged_in = True
    else:
        logged_in = False

    searchRec = request.vars.searchRec
    locationRec = request.vars.locationRec
    if searchRec is None or searchRec is "":
        print "searchEmpty"
    if locationRec is None or locationRec is "":
        print "locationEmpty"
        return response.json(dict(
            recommendation=[],
            logged_in=logged_in,
            has_more=False,
            next_page='',
            location=''
        ))
    else:
        url = "https://maps.googleapis.com/maps/api/geocode/json?address=" + locationRec + '&key=' + api_key
        resultLocation = json.loads(urllib.urlopen(url).read())
        lat = resultLocation['results'][0]['geometry']['location']['lat']
        long = resultLocation['results'][0]['geometry']['location']['lng']
        location = resultLocation['results'][0]['formatted_address']
        print lat
        print long

    token = request.vars.next_page
    if token is not '':
        print "the damn thing has a token??"
        next_page_query = '&pagetoken=' + token
    else:
        print "the damn thing has no token"
        next_page_query = ''

    url = ''

    if searchRec is not '':
        url = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=' + repr(lat) + ',' + repr(
            long) + '&radius=1000&keyword=' + searchRec + '&key=' + api_key + next_page_query
    elif searchRec is '':
        url = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=' + repr(lat) + ',' + repr(
            long) + '&radius=1000&type=point_of_interest&key=' + api_key + next_page_query

    resultStuff = json.loads(urllib.urlopen(url).read())

    recommendation = []
    lengthOfQuery = len(resultStuff["results"])
    # for i in range(0, lengthOfQuery):
    for i in range(0, 2):
        more_info = get_more_info(resultStuff['results'][i]["place_id"])
        if "price_level" not in resultStuff['results'][i]:
            priceT = 0
        else:
            priceT = resultStuff['results'][i]["price_level"]

        if "rating" not in resultStuff['results'][i]:
            ratingT = 0
        else:
            ratingT = resultStuff['results'][i]["rating"]

        if 'photos' in resultStuff['results'][i]:
            place_id = resultStuff['results'][i]['photos'][0]['photo_reference']
            places = get_place_icons(place_id)
        else:
            # TODO: Replace default image with PlanIt Logo
            places = "http://www.w3schools.com/css/trolltunga.jpg"

        if 'formatted_address' not in more_info['result']:
            addr = ''
        else:
            addr = more_info['result']['formatted_address']

        if 'formatted_phone_number' not in more_info['result']:
            print('phone number not found')
            phone_number = ''
        else:
            phone_number = more_info['result']['formatted_phone_number']

        if 'geometry' not in more_info['result']:
            lat = 0
            lng = 0
        else:
            lat = more_info['result']['geometry']['location']['lat']
            lng = more_info['result']['geometry']['location']['lng']

        if 'opening_hours' not in more_info['result']:
            hours = []
        else:
            hours = more_info['result']['opening_hours']['weekday_text']
            print(hours)
        t = dict(
            name=resultStuff['results'][i]["name"],
            neighborhood=resultStuff['results'][i]["vicinity"],
            price=priceT,
            rating=ratingT,
            image=places,
            address=addr,
            phone_number=phone_number,
            lat=lat,
            lng=lng,
            id=ID_counter,
            hours=hours,
        )
        recommendation.append(t)
        ID_counter = ID_counter + 1

    if 'next_page_token' in resultStuff:
        more_results_page = resultStuff['next_page_token']
        has_more = True
    else:
        more_results_page = ''
        has_more = False

    return response.json(dict(
        recommendation=recommendation,
        logged_in=logged_in,
        has_more=has_more,
        next_page=more_results_page,
        location=location
    ))

def add_stop():
    stop_id = db.planit_stop.insert(
        label = request.vars.label,
        start_time = request.vars.start_time,
        end_time = request.vars.end_time,
        cust_place = request.vars.cust_place,
        cust_address = request.vars.cust_address,
        parent = request.vars.parent
    )
    plan = db(db.planit_plan.id == request.vars.parent).select().first()
    plan = plan.update_record(stops=plan.stops+[stop_id] if plan.stops is not None else [stop_id])
    stop = db.planit_stop(stop_id)
    print plan
    print stop
    return response.json(dict(stop=stop))


def del_stop():
    db(db.planit_stop.id == request.vars.stop_id).delete()
    # TODO: need to also delete the stop from its plan's list of stop references
    return "stop deleted"


def get_stops():
    stops = []
    rows = db(db.planit_stop.parent == int(request.vars.id)).select(db.planit_stop.ALL)
    for i, r in enumerate(rows):
            s = dict(
                id = r.id,
                label = r.label,
                start_time = r.start_time if r.start_time not in (None, "0", "") else "12:00",
                end_time = r.end_time if r.end_time not in (None, "0", "") else "12:00",
                cust_place = r.cust_place,
                cust_address = r.cust_address,
                created_by = r.created_by,
                created_on = r.created_on
            )
            stops.append(s)
    logged_in = auth.user_id is not None
    return response.json(dict(
        stops=stops,
        logged_in=logged_in,
    ))


def select_plan():
    pid = int(request.vars.plan_id) if request.vars.plan_id is not None else 0
    s = db(db.planit_plan.id == pid).select(db.planit_plan.ALL).first()
    selection = dict(
        id = s.id,
        label = s.label,
        start_date = s.start_date,
        start_time = s.start_time,
        end_time = s.end_time,
        start_location = s.start_location,
        longitude = s.longitude,
        latitude = s.latitude,
        stops = s.stops,
        created_by = s.created_by,
        created_on = s.created_on
    )
    print selection
    logged_in = auth.user_id is not None
    return response.json(dict(plan=selection, logged_in=logged_in))

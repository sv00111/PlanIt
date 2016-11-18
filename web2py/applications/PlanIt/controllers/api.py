import random
import json
import time
import urllib
import urllib2

api_key = 'AIzaSyBxR53fN_ZDwYgoJ31tYUcAc-riycqih-w'


def recommendation():
    pass

# Mocks implementation.
# def get_tracks():
#     start_idx = int(request.vars.start_idx) if request.vars.start_idx is not None else 0
#     end_idx = int(request.vars.end_idx) if request.vars.end_idx is not None else 0
#     # We just generate a lot of of data.
#     tracks = []
#     for i in range(start_idx, end_idx):
#         t = dict(
#             artist=random.choice(['IU', 'Ailee', 'T-ara', 'Mamamoo']),
#             album=random.choice(['Modern times', 'Melting', 'Absolute']),
#             title=random.choice(['Falling U', 'TTL', 'Piano Man']),
#             duration=random.uniform(3 * 60, 4 * 60),
#             rating=random.randint(1, 5),
#             num_plays=random.randint(0, 100),
#         )
#         tracks.append(t)
#     has_more = True
#     if auth.user:
#         logged_in = True
#     else:
#         logged_in = False
#     return response.json(dict(
#         tracks=tracks,
#         logged_in=logged_in,
#         has_more=has_more,
#     ))

def test():
    url = "https://maps.googleapis.com/maps/api/place/nearbysearch/output?parameters"
    f = urllib.urlopen(url)
    s = f.read()
    return s


def get_place_icons(places):
    # photos = [];
    # for i in places:
    #     place_id = i['photos'].photo_reference
    #     print(place_id)
    url = 'https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=' + places + '&key=' + api_key
    return url


# def get_reviews(place):
#     review = []
#     url = 'https://maps.googleapis.com/maps/api/place/details/json?placeid=' + place + '&key=' + api_key
#     results = json.loads(urllib.urlopen(url).read())
#     return results['reviews']
#

# trying to add if conditions
# if has been loaded before, just append results, else return completely new array
import json

def get_recommendations():

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
            location = ''
        ))
    else:
        url = "https://maps.googleapis.com/maps/api/geocode/json?address=" + locationRec + '&key=' + api_key
        print "da url location is: {0}".format(url)
        resultLocation = json.loads(urllib.urlopen(url).read())
        lat = resultLocation['results'][0]['geometry']['location']['lat']
        long = resultLocation['results'][0]['geometry']['location']['lng']
        location = resultLocation['results'][0]['formatted_address']
        print lat
        print long

    # print "LOLFJIOFJAWOJ {0}".format(request.vars.next_page)
    token = request.vars.next_page
    if token is not '':
        next_page_query ='&pagetoken='+token
    else:
        next_page_query = ''

    url = ''

    if searchRec is not '':
        print "in next"
        url = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=' + repr(lat) + ',' + repr(
            long) + '&radius=500&keyword=' + searchRec + '&key=' + api_key + next_page_query
    elif searchRec is '':
        print "in query"
        url = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=' + repr(lat) + ',' + repr(
            long) + '&radius=500&keyword=restaurant&key=' + api_key + next_page_query

    print url

    resultStuff = json.loads(urllib.urlopen(url).read())

    print (resultStuff["results"])

    recommendation = []
    lengthOfQuery = len(resultStuff["results"])
    print "this is length {0}".format(lengthOfQuery)
    for i in range(0, lengthOfQuery):

        print
        if "price_level" not in resultStuff['results'][i]:
            priceT = 0
            print priceT
        else:
            priceT = resultStuff['results'][i]["price_level"]
            print priceT

        if "rating" not in resultStuff['results'][i]:
            ratingT = 0
            print ratingT
        else:
            ratingT = resultStuff['results'][i]["rating"]
            print ratingT

        if 'photos' in resultStuff['results'][i]:
            place_id = resultStuff['results'][i]['photos'][0]['photo_reference']
            print (place_id)
            places = get_place_icons(place_id)
        else:
            # TODO: Replace default image with PlanIt Logo
            places = "http://www.w3schools.com/css/trolltunga.jpg"

        t = dict(
            name=resultStuff['results'][i]["name"],
            neighborhood=resultStuff['results'][i]["vicinity"],
            price=priceT,
            rating=ratingT,
            image=places,
        )
        recommendation.append(t)

    more_results_page = ''
    if 'next_page_token' in resultStuff:
        print(resultStuff['next_page_token'])
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
        location =location
    ))


def get_more_info():
    # read in place id from button click
    place_id = ''
    query_url = 'https://maps.googleapis.com/maps/api/place/details/json?placeid=' + place_id + '+&key =' + api_key
    return ()

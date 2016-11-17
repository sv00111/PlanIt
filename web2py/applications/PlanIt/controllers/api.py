import random
import json
import time
import urllib
import urllib2
api_key = 'AIzaSyBxR53fN_ZDwYgoJ31tYUcAc-riycqih-w'


def recommendation():
    pass


# Mocks implementation.
def get_tracks():


    start_idx = int(request.vars.start_idx) if request.vars.start_idx is not None else 0
    end_idx = int(request.vars.end_idx) if request.vars.end_idx is not None else 0
    # We just generate a lot of of data.
    tracks = []
    for i in range(start_idx, end_idx):
        t = dict(
            artist = random.choice(['IU', 'Ailee', 'T-ara', 'Mamamoo']),
            album = random.choice(['Modern times', 'Melting', 'Absolute']),
            title = random.choice(['Falling U', 'TTL', 'Piano Man']),
            duration = random.uniform(3 * 60, 4 * 60),
            rating = random.randint(1, 5),
            num_plays = random.randint(0, 100),
        )
        tracks.append(t)
    has_more = True
    if auth.user:
        logged_in = True
    else:
        logged_in = False
    return response.json(dict(
        tracks=tracks,
        logged_in=logged_in,
        has_more=has_more,
    ))

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

def get_reviews(place):
    review = []
    url = 'https://maps.googleapis.com/maps/api/place/details/json?placeid=' + place + '&key=' + api_key
    results = json.loads(urllib.urlopen(url).read())
    return results['reviews']

#trying to add if conditions
#if has been loaded before, just append results, else return completely new array
import json
def get_recommendations():

    searchRec = request.vars.searchRec
    print "LOL1" + searchRec
    locationRec = request.vars.locationRec
    print "LOL2" + locationRec
    if searchRec is None or searchRec is "":
        print "searchEmpty"
    if locationRec is None or locationRec is "":
        print "locationEmpty"

    query = None #request.vars.search_params
    next_page = request.vars.next_page
    url = ''
    print "this"
    #if query is None:
     #   url = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=-33.8670522,151.1957362&radius=500&type=restaurant&key=' + api_key
    if searchRec is not '':
        print "in next"
        # url = 'https://maps.googleapis.com/maps/api/place/textsearch/xml?query=' + searchRec + '&key=' + api_key
        url = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=-33.8670522,151.1957362&radius=500&keyword=' + searchRec + '&key=' + api_key
    elif searchRec is '':
        print "in query"
        url = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=-33.8670522,151.1957362&radius=500&keyword=restaurant&key=' + api_key
    # elif query is None:
    #     print "No Search Params Found"
    #     #query using nearby search, only params we need to passs here are longitude and latitude
    #     url = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=-33.8670522,151.1957362&radius=500&type=restaurant&key=' + api_key
    # else:
    #     print "Found Search Params"
    #     #query using keywords, we'll need to create a textbox where users can input words
    #     #query = 'food'
    #     url = 'https://maps.googleapis.com/maps/api/place/textsearch/json?query='+ query +'&key=' + api_key
    #     print "reaches this"
    print url
    #processes json request
    resultStuff = json.loads(urllib.urlopen(url).read())
    # result = (resultStuff.replace('\\n', ''))
    print (resultStuff["results"])
    # print result
    #result['results'] returns us an array of each location with their data. we want to pass this into the view
    #inside of view we can use a for loop to create div elements for side bar



    #stuff down here will need to be changed to work with vue or whatever javascript framework we use
    start_idx = int(request.vars.start_idx) if request.vars.start_idx is not None else 0
    end_idx = int(request.vars.end_idx) if request.vars.end_idx is not None else 0
    # We just generate a lot of of data.
    recommendation = []
    print "this is length {0}".format(len(resultStuff["results"]))
    for i in range(0, 1):
        # if not resultStuff['results'][i]:
        #     break;
        priceT = None
        if "price_level" not in resultStuff['results'][i]:
            priceT = 0
            print priceT
        else:
            priceT = resultStuff['results'][i]["price_level"]
            print priceT

        ratingT = None
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
            # photos.append(place_id)
        else:
            places = "http://www.w3schools.com/css/trolltunga.jpg"
            # photos.append(place_id)


        t = dict(
            name = resultStuff['results'][i]["name"],
            # random.choice(['Philz', 'Taco Bell', 'Subway', 'Thai', 'Chinese', 'Japanese']),
            neighborhood = resultStuff['results'][i]["vicinity"],
            # random.choice(['SoMa', 'Mission', 'Financial', 'Civic Center', 'Downtown', 'Evergreen']),
            price = priceT,
            # random.randint(1, 4),
            rating = ratingT,
            image = places,
        )
        recommendation.append(t)

    more_results_page =''
    if 'next_page_token' in resultStuff:
        print(resultStuff['next_page_token'])
        more_results_page = resultStuff['next_page_token']
        has_more = True
    else:
        more_results_page = None
        has_more = False
    #has_more = (result['next_page_token'] is not None)
    if auth.user:
        logged_in = True
    else:
        logged_in = False

    return response.json(dict(
        recommendation=recommendation,
        logged_in=logged_in,
        has_more=has_more,
        next_page = more_results_page
    ))

def get_more_info():
    #read in place id from button click
    place_id = ''
    query_url = 'https://maps.googleapis.com/maps/api/place/details/json?placeid=' + place_id + '+&key =' + api_key
    return()


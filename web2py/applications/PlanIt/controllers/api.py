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


import json
def get_recommendations():
    fields = None
    photos = []
    url = ''
    print "this"
    if fields is None:
        print "LOL"
        #query using nearby search, only params we need to passs here are longitude and latitude
        url = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=-33.8670522,151.1957362&radius=500&type=restaurant&keyword=cruise&key=' + api_key
    else:
        print "this"
        #query using keywords, we'll need to create a textbox where users can input words
        query = 'food'
        url = 'https://maps.googleapis.com/maps/api/place/textsearch/json?query='+ query +'&key=' + api_key
        print "reaches this"
    print url
    #processes json request
    qresult = urllib.urlopen(url).read()
    result = json.loads(qresult.replace('\\n', ''))

    #result['results'] returns us an array of each location with their data. we want to pass this into the view
    #inside of view we can use a for loop to create div elements for side bar



    #stuff down here will need to be changed to work with vue or whatever javascript framework we use
    start_idx = int(request.vars.start_idx) if request.vars.start_idx is not None else 0
    end_idx = int(request.vars.end_idx) if request.vars.end_idx is not None else 0
    # We just generate a lot of of data.
    recommendation = []
    for i in range(start_idx, end_idx-1):
        places = None
        print result['results'][i]
        print
        print i
        print
        if not result['results'][i]:
            break

        if 'photos' in result['results'][i]:
            place_id = result['results'][i]['photos'][0]['photo_reference']
            print (place_id)
            places = get_place_icons(place_id)
            photos.append(place_id)
        else:
            places = "http://www.w3schools.com/css/trolltunga.jpg"
            photos.append(place_id)

        t = dict(
            name = random.choice(['Philz', 'Taco Bell', 'Subway', 'Thai', 'Chinese', 'Japanese']),
            neighborhood = random.choice(['SoMa', 'Mission', 'Financial', 'Civic Center', 'Downtown', 'Evergreen']),
            price = random.randint(1, 4),
            rating = random.randint(1, 5),
            photos = places
        )
        recommendation.append(t)

    #print(result['page_token'])
    if 'next_page_token' in result:
        has_more = True
    else:
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
    ))

def get_more_info():
    #read in place id from button click
    place_id = ''
    query_url = 'https://maps.googleapis.com/maps/api/place/details/json?placeid='
    + place_id + '+&key =' + api_key
    return()
import random

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


def get_recommendation():
    start_idx = int(request.vars.start_idx) if request.vars.start_idx is not None else 0
    end_idx = int(request.vars.end_idx) if request.vars.end_idx is not None else 0
    # We just generate a lot of of data.
    recommendation = []
    for i in range(start_idx, end_idx):
        t = dict(
            name = random.choice(['Philz', 'Taco Bell', 'Subway', 'Thai', 'Chinese', 'Japanese']),
            neighborhood = random.choice(['SoMa', 'Mission', 'Financial', 'Civic Center', 'Downtown', 'Evergreen']),
            price = random.randint(1, 4),
            rating = random.randint(1, 5),
        )
        recommendation.append(t)
    has_more = True
    if auth.user:
        logged_in = True
    else:
        logged_in = False
    return response.json(dict(
        recommendation=recommendation,
        logged_in=logged_in,
        has_more=has_more,
    ))


def add_stop():
    stop_id = db.planit_stop.insert(
        label = request.vars.label,
        start_time = request.vars.start_time,
        end_time = request.vars.end_time,
        cust_place = request.vars.cust_place,
        cust_address = request.vars.cust_address,
    )
    stop = db.planit_stop(stop_id)
    return response.json(dict(stop=stop))


def get_stops():
    start_idx = int(request.vars.start_idx) if request.vars.start_idx is not None else 0
    end_idx = int(request.vars.end_idx) if request.vars.end_idx is not None else 0
    stops = []
    has_more = False
    rows = db().select(db.planit_stop.ALL, limitby=(start_idx, end_idx + 1))
    for i, r in enumerate(rows):
        if i < end_idx - start_idx:
            s = dict(
                label = r.label,
                start_time = r.start_time,
                end_time = r.end_time,
                cust_place = r.cust_place,
                cust_address = r.cust_address,
                created_by = r.created_by,
                created_on = r.created_on
            )
            stops.append(s)
        else:
            has_more = True
    logged_in = auth.user_id is not None
    return response.json(dict(
        stops=stops,
        logged_in=logged_in,
    ))

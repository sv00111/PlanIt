import random

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

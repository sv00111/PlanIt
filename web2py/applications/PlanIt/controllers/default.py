# -*- coding: utf-8 -*-
# this file is released under public domain and you can use without limitations

# -------------------------------------------------------------------------
# This is a sample controller
# - index is the default action of any application
# - user is required for authentication and authorization
# - download is for downloading files uploaded in the db (does streaming)
# -------------------------------------------------------------------------

import random
import json
import time
import urllib
import urllib2


@auth.requires_login()
def index():
    # Generate a random number betw 1 and 6.
    n = random.randint(1, 6)
    s = '' if n == 1 else 's'
    # return {'n': n}
    return dict(enne=n,
                s=s,
                mylist=[1, 2, 3, 5, 6, 9])

def forgotPass():
   return dict(reset = auth.request_reset_password())

@auth.requires_login()
def home():
    p_id = request.args(0) if request.args(0) not in (None, 0, "") else "-1"
    return dict(p_id=p_id)

@auth.requires_login()
def plans():
    return dict()

def user():
    """
    exposes:
    http://..../[app]/default/user/login
    http://..../[app]/default/user/logout
    http://..../[app]/default/user/register
    http://..../[app]/default/user/profile
    http://..../[app]/default/user/retrieve_password
    http://..../[app]/default/user/change_password
    http://..../[app]/default/user/bulk_register
    use @auth.requires_login()
        @auth.requires_membership('group name')
        @auth.requires_permission('read','table name',record_id)
    to decorate functions that need access control
    also notice there is http://..../[app]/appadmin/manage/auth to allow administrator to manage users
    """
    # return dict(form = auth())

    # TODO: make this from comment to example 'example@gmail.com'
    # TODO: try and make it a placeholder, intsead of under the input type.

    if request.args(0) == 'login':
        db.auth_user.email.comment = 'Enter your email address'
        db.auth_user.password.comment = 'Enter your Password'
    return dict(form = auth(), login=auth.login(), register=auth.register())


def register():
    return dict(register=auth.register(), login=auth.login())


def newPlan():
    form = SQLFORM.factory(
        Field('label', length=256, default="New Plan"),
        Field('start_date', 'date', default=datetime.date.today()),
        Field('start_time', requires=[IS_TIME()]),
        Field('end_time', requires=[IS_TIME()]),
        Field('start_location')
    )
    if form.process().accepted:
        db.planit_plan.insert(
            label = form.vars.label,
            start_date = form.vars.start_date,
            start_time = form.vars.start_time,
            end_time = form.vars.end_time,
            start_location = form.vars.start_location
        )
        session.flash = T('Plan created.')
        redirect(URL('default', 'home'))
    return dict(form=form)


def recommendation():
    """
    example action using the internationalization operator T and flash
    rendered by views/default/index.html or views/generic.html

    if you need a simple wiki simply replace the two lines below with:
    return auth.wiki()
    """

    response.flash = T("Hello World")
    return dict(message=T('Welcome to web2py!'))


@cache.action()
def download():
    """
    allows downloading of uploaded files
    http://..../[app]/default/download/[filename]
    """
    return response.download(request, db)


def call():
    """
    exposes services. for example:
    http://..../[app]/default/call/jsonrpc
    decorate with @services.jsonrpc the functions to expose
    supports xml, json, xmlrpc, jsonrpc, amfrpc, rss, csv
    """
    return service()


def place():
    url = 'https://maps.googleapis.com/maps/api/place/textsearch/json?query=restaurants+in+Sydney&key=AIzaSyBxR53fN_ZDwYgoJ31tYUcAc-riycqih-w'
    response = str(urllib2.urlopen(url).read())
    result = json.loads(response.replace('\\n', ''))
    #these should be the main attributes we use when we call the api
    #we need to create objects for these and store them within the vue array
    print result['next_page_token']
    for i in result['results']:
        print(i['name'])
        print(i['rating'])
        print(i['formatted_address'])
        #print(i['price_level'])
        print(i['place_id'])
        print(i['icon'])
        print(i['geometry']['location'])
    return dict()

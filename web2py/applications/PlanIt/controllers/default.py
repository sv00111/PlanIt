# -*- coding: utf-8 -*-
# this file is released under public domain and you can use without limitations

# -------------------------------------------------------------------------
# This is a sample controller
# - index is the default action of any application
# - user is required for authentication and authorization
# - download is for downloading files uploaded in the db (does streaming)
# -------------------------------------------------------------------------

import random

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
    return dict()

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
        Field('name', label='Plan Name'),
        Field('startDate', label='Start'),
        Field('endDate', label='End'),
        Field('location', label='Location')
    )
    if form.process().accepted:
        db.createdPlans.insert(planName = form.vars.name,
                       startDate = form.vars.startTime,
                       endDate = form.vars.endTime,
                       planLocation = form.vars.location)
        session.flash = T('Plan created.')
        redirect(URL('default', 'index'))
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


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
    p_id = request.args(0)
    if p_id is None:
        p_id = db(db.planit_plan.created_by == auth.user.email).select(db.planit_plan.id).last()
        if p_id is None:
            redirect(URL('default', 'newPlan'))
        else:
            p_id = p_id.id
    return dict(p_id=p_id)

@auth.requires_login()
def plans():
    return dict()

@auth.requires_login()
def allplans():
    plans = db(db.planit_plan).select(db.planit_plan.label, db.planit_plan.id, orderby=~db.planit_plan.id)
    return dict(plans=plans)


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
        Field('start_location')
    )
    if form.process().accepted:
        db.planit_plan.insert(
            label = form.vars.label,
            start_date = form.vars.start_date,
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


from gluon.tools import Mail

def testMail():
    if request.args is None:
        response.flash = 'email sent sucessfully.'
        print 'please click on a proper plan'
        redirect(URL('default', 'home'))
    else:
        urlArg =  request.args(0)
    mail = Mail()
    # mail.settings.server = 'smtp@gmail.com:465'
    mail.settings.server = 'smtp.gmail.com:587'
    mail.settings.sender = 'planit183@gmail.com'
    mail.settings.login = 'planit183@gmail.com:Plan-It183'
    form = SQLFORM.factory(
    Field('name', requires=IS_NOT_EMPTY()),
    Field('email', requires =[ IS_EMAIL(error_message='invalid email!'), IS_NOT_EMPTY() ]),
    Field('subject', requires=IS_NOT_EMPTY(), default = 'I would like to share my plan with you!'),
    Field('message', requires=IS_NOT_EMPTY(), type='text', default = 'Please check the link I sent you')
    )
    if form.process().accepted:
        session.name = form.vars.name
        session.email = form.vars.email
        session.subject = form.vars.subject
        session.message = form.vars.message
        if mail:
            # TODO: change  URL('default', 'home', args = [urlArg]) on line 161 when we host the url
            if mail.send(to=[session.email],
                         subject=session.subject,
                         message= 'Hi ' + session.name + '!\n' + session.message + ".\n " + URL('default', 'home', args = [urlArg]) + "\n" + "From \n--" + auth.user.email
                         ):
                response.flash = 'email sent sucessfully.'
                print 'success'
                redirect(URL('default', 'home', args = [urlArg]))
                session.flash = T('Plan shared sucessfully')
            else:
                print "Error sending email"
                response.flash = 'fail to send email sorry!'
        else:
            response.flash = 'Unable to send the email : email parameters not defined'
    elif form.errors:
        response.flash = 'form has errors.'

        #response.flash = 'form accepted.'
    elif form.errors:
        response.flash='form has errors.'

    return dict(form=form)

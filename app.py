#!/usr/bin/python

from flask import Flask, render_template, request, send_from_directory
import simplejson


import MySQLdb
import _mysql
from widgets import test

app = Flask(__name__, static_url_path='')

# TEMAPLATE ROUTES

@app.route('/enter', methods=['GET'])
def get_main():
    return send_from_directory('templates', 'index.html')

@app.route('/widgetView', methods=['GET'])
def widget_view():
    return render_template('widget-view.html')





# APIs

@app.route('/deleteWidget/<order>', methods=['DELETE'])
def delete_widget(order):

    db=MySQLdb.connect(host="localhost", user="root", passwd="565d7a7ced00c01e37edf4eb6dd05f3f7e607d1f2b49acb2", db="widgets")
    cursor=db.cursor()

    param = dict(_id=order)

    query = """DELETE FROM `orders` WHERE id=%(_id)s"""

    try:

        cursor.execute(query,param)
        db.commit()

        return simplejson.dumps({'success':str('you deleted it')})


    except Exception as e:
        return simplejson.dumps({'error':str(e)})

    finally:
        cursor.close()
        db.close()

@app.route('/incCount/<orderId>', methods=['POST','GET'])
def inc_order(orderId):

    db=MySQLdb.connect(host="localhost", user="root", passwd="565d7a7ced00c01e37edf4eb6dd05f3f7e607d1f2b49acb2", db="widgets")
    cursor=db.cursor()

    param = dict(_id=orderId)

    query = """update orders, (SELECT count as prevCount FROM orders WHERE id=%(_id)s) as t2 set count=t2.prevCount+1 where id=%(_id)s;"""


    try:

        cursor.execute(query,param)
        db.commit()

        return simplejson.dumps({'success':str('you incremented it')})


    except Exception as e:
        return simplejson.dumps({'error':str(e)})

    finally:
        cursor.close()
        db.close()

@app.route('/getAvalQuantity/<id>', methods=['POST','GET'])
def get_avalable_quantity(id):

    db=MySQLdb.connect(host="localhost", user="root", passwd="565d7a7ced00c01e37edf4eb6dd05f3f7e607d1f2b49acb2", db="widgets")
    cursor=db.cursor()

    param = dict(_id=id)

    query = """SELECT avalQuantity,id FROM orders WHERE id=%(_id)s"""

    try:

        cursor.execute(query,param)
        data=cursor.fetchall()

        return simplejson.dumps({'success':str(data)})


    except Exception as e:
        return simplejson.dumps({'error':str(e)})

    finally:
        cursor.close()
        db.close()





@app.route('/searchByCategory/<cat>', methods=['POST','GET'])
def search_by_category(cat):

    db=MySQLdb.connect(host="localhost", user="root", passwd="565d7a7ced00c01e37edf4eb6dd05f3f7e607d1f2b49acb2", db="widgets")
    cursor=db.cursor()

    param = dict(_cat=cat)

    query = """SELECT * FROM orders WHERE categroy=%(_cat)s"""

    try:

        cursor.execute(query,param)
        data=cursor.fetchall()

        return simplejson.dumps({'success':str(data)})


    except Exception as e:
        return simplejson.dumps({'error':str(e)})

    finally:
        cursor.close()
        db.close()


# NEW

@app.route('/getOrders', methods=['POST','GET'])
def get_orders():

    db=MySQLdb.connect(host="localhost", user="root", passwd="565d7a7ced00c01e37edf4eb6dd05f3f7e607d1f2b49acb2", db="widgets")
    cursor=db.cursor()

    query = """SELECT * FROM orders"""

    try:

        cursor.execute(query)
        data=cursor.fetchall()

        return simplejson.dumps({'success':str(data)})


    except Exception as e:
        return simplejson.dumps({'error':str(e)})

    finally:
        cursor.close()
        db.close()

@app.route('/getWidgets', methods=['POST','GET'])
def get_widgets():

    db=MySQLdb.connect(host="localhost", user="root", passwd="565d7a7ced00c01e37edf4eb6dd05f3f7e607d1f2b49acb2", db="widgets")
    cursor=db.cursor()

    query = """SELECT id,name,inventory,finish,size,types FROM widget"""

    try:

        cursor.execute(query)
        data=cursor.fetchall()

        return simplejson.dumps({'success':str(data)})


    except Exception as e:
        return simplejson.dumps({'error':str(e)})

    finally:
        cursor.close()
        db.close()

@app.route('/getSizes', methods=['POST','GET'])
def get_sizes():

    db=MySQLdb.connect(host="localhost", user="root", passwd="565d7a7ced00c01e37edf4eb6dd05f3f7e607d1f2b49acb2", db="widgets")
    cursor=db.cursor()

    query = """SELECT * FROM sizes;"""

    try:

        cursor.execute(query)
        data=cursor.fetchall()

        return simplejson.dumps({'success':str(data)})


    except Exception as e:
        return simplejson.dumps({'error':str(e)})

    finally:
        cursor.close()
        db.close()

@app.route('/getFinishes', methods=['POST','GET'])
def get_finishes():

    db=MySQLdb.connect(host="localhost", user="root", passwd="565d7a7ced00c01e37edf4eb6dd05f3f7e607d1f2b49acb2", db="widgets")
    cursor=db.cursor()

    query = """SELECT * FROM finishes;"""

    try:

        cursor.execute(query)
        data=cursor.fetchall()

        return simplejson.dumps({'success':str(data)})


    except Exception as e:
        return simplejson.dumps({'error':str(e)})

    finally:
        cursor.close()
        db.close()

@app.route('/getTypes', methods=['POST','GET'])
def get_types():

    db=MySQLdb.connect(host="localhost", user="root", passwd="565d7a7ced00c01e37edf4eb6dd05f3f7e607d1f2b49acb2", db="widgets")
    cursor=db.cursor()

    query = """SELECT * FROM types;"""

    try:

        cursor.execute(query)
        data=cursor.fetchall()

        return simplejson.dumps({'success':str(data)})


    except Exception as e:
        return simplejson.dumps({'error':str(e)})

    finally:
        cursor.close()
        db.close()

@app.route('/saveWidget/<siz>/<fin>/<typ>/<inv>/<name>', methods=['POST','GET'])
def save_widget(siz,fin,typ,inv,name):

    db=MySQLdb.connect(host="localhost", user="root", passwd="565d7a7ced00c01e37edf4eb6dd05f3f7e607d1f2b49acb2", db="widgets")
    cursor=db.cursor()

    param = dict(_siz=siz, _fin=fin, _typ=typ, _inv=inv,  _name=name)

    query = """INSERT INTO widget (`size`,`finish`,`types`,`inventory`,`name`) VALUES (%(_siz)s,%(_fin)s,%(_typ)s,%(_inv)s,%(_name)s)"""

    try:

        cursor.execute(query,param)
        db.commit()

        return simplejson.dumps({'success':str('you have a new widget ')})


    except Exception as e:
        return simplejson.dumps({'error':str(e)})

    finally:
        cursor.close()
        db.close()

@app.route('/updateInventory/<id>/<newValue>', methods=['POST','GET'])
def update_inventory(id,newValue):

    db=MySQLdb.connect(host="localhost", user="root", passwd="565d7a7ced00c01e37edf4eb6dd05f3f7e607d1f2b49acb2", db="widgets")
    cursor=db.cursor()

    param = dict(_id=id,_newValue=newValue)

    query = """UPDATE widget SET inventory=%(_newValue)s WHERE id=%(_id)s"""

    try:

        cursor.execute(query,param)
        db.commit()

        return simplejson.dumps({'success':str('you updated inventory')})


    except Exception as e:
        return simplejson.dumps({'error':str(e)})

    finally:
        cursor.close()
        db.close()



if __name__ == '__main__':
  app.run(host='0.0.0.0')

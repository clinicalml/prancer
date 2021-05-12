from flask_script import Manager

from application.app import app
from application.utils.log import open_log

manager = Manager(app)


if __name__ == '__main__':
    open_log()
    manager.run()

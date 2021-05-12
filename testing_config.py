from flask_testing import TestCase
from application.app import app
import os
from setup import basedir
import json


class BaseTestConfig(TestCase):

    def create_app(self):
        app.config.from_object('config.TestingConfig')
        return app

    def setUp(self):
        self.app = self.create_app().test_client()

    def tearDown(self):
        return

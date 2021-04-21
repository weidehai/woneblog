from test.base import BaseTestCase
from wone import create_app
from flask import request,json
import logging

class BlogAdminTestCase(BaseTestCase):
    def setUp(self):
        self.app = create_app()
        self.client = self.app.test_client()

    def tearDown(self):
        pass

    def test_manage(self):
        with self.client as client:
            rv = self.client.get('/adminmanage')
            assert rv.status_code==302
            self.app.config['LOGIN_DISABLED'] = True
            rv = self.client.get('/adminmanage')
            logging.info(rv.data)
            assert b'data_article_total=""' not in rv.data

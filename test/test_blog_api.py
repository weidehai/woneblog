from test.base import BaseTestCase
from wone import create_app
from flask import request,json
import logging

class BlogApiTestCase(BaseTestCase):
    def setUp(self):
        self.app = create_app()
        self.client = self.app.test_client()

    def tearDown(self):
        pass

    def test_articles_api(self):
        with self.client as client:
            rv = self.client.get('/api/articles?page=1')
            assert rv is not None
            assert rv.data is not None
            assert isinstance(rv.data,bytes)
            assert b'article_content' in rv.data
            assert isinstance(json.loads(rv.data),list)
            assert request.args['page'] == '1'

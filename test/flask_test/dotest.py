import unittest
from .test_model import ModelTestCase
from .test_blog_api import BlogApiTestCase
from .test_blog_admin import BlogAdminTestCase

suite=unittest.TestSuite()
loader=unittest.TestLoader()
suite.addTest(loader.loadTestsFromTestCase(ModelTestCase))
suite.addTest(loader.loadTestsFromTestCase(BlogApiTestCase))
suite.addTest(loader.loadTestsFromTestCase(BlogAdminTestCase))

def start_test():
    with open("unittest.result","w",encoding='utf-8') as file:
        runner = unittest.TextTestRunner(stream=file, descriptions=True, verbosity=2)
        runner.run(suite)
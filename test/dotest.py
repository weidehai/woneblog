import unittest
from .test_model import ModelTestCase
from .test_blog_api import BlogApiTestCase

suite=unittest.TestSuite()
loader=unittest.TestLoader()
suite.addTest(loader.loadTestsFromTestCase(ModelTestCase))
suite.addTest(loader.loadTestsFromTestCase(BlogApiTestCase))

def start_test():
    with open("unittest.result","w",encoding='utf-8') as file:
        runner = unittest.TextTestRunner(stream=file, descriptions=True, verbosity=2)
        runner.run(suite)
#!/usr/bin/python
#
# Runs the tests passed on the command line
#
import os, sys

def getUnitTestFile() :
  return os.path.abspath(__file__)

# site specific variables
instance_home = '/home/%s/zope' % os.environ['USER']
software_home = '/usr/lib/zope/lib/python'
tests_home = os.path.join(instance_home, 'tests')
tests_framework_home = os.path.dirname(os.path.abspath(__file__))

if '__INSTANCE_HOME' not in globals().keys() :
  __INSTANCE_HOME = instance_home

def runUnitTestList(test_list) :
  os.environ['INSTANCE_HOME'] = instance_home
  os.environ['SOFTWARE_HOME'] = software_home
  os.environ['COPY_OF_INSTANCE_HOME'] = instance_home
  os.environ['COPY_OF_SOFTWARE_HOME'] = software_home

  execfile(os.path.join(tests_framework_home, 'framework.py')) 

  import unittest
  TestRunner = unittest.TextTestRunner
  suite = unittest.TestSuite()

  os.chdir(tests_home)

  for test in test_list:
    m = __import__(test)
    if hasattr(m, 'test_suite'):
      suite.addTest(m.test_suite())

  TestRunner().run(suite)

if __name__ == '__main__' :
  runUnitTestList(test_list=sys.argv[1:])

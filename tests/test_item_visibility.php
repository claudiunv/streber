<?php

/**
* test item visibilty
*
* This test-file is been used by testsuite_pages.php
* All Functions defined in TestPagesAll which start with "test" will be tested.
*
*/
class TestItemVisibility extends WebTestCase {
    
    function testStalin() {

        TestEnvironment::prepare('fixtures/project_setup.sql');
        $this->addHeader('USER_AGENT: streber_unit_tester');

        $g_streber_url= "http://localhost/streber_head";

        ### logout first ###
        $this->assertTrue($this->get("$g_streber_url"), 'getting login page (%s)' );
        $this->assertWantedPattern('/please login/i',                                            'check content (%s)');
        $this->assertValidHtmlStucture('login');

        ### Test login working ###
        $this->assertTrue( $this->setField('login_name', 'stalin'));
        $this->assertTrue( $this->setField('login_password', 'stalin_secret') );
        $this->assertTrue( $this->clickSubmit('Submit'));
        $this->assertNoUnwantedPattern('/<b>Warning<\/b>:|<b>Error<\/b>:|<b>Notice<\/b>:/i',    'php-error found (%s)' );
        $this->assertNoUnwantedPattern('/invalid login/i',  'check content (%s)');
        $this->assertNoUnwantedPattern('/<x>/');
        $this->assertNoUnwantedPattern('/&amp;lt;x&amp;gt;/',     'check double escaped data (%s)');

        $this->assertWantedPattern('<body class="projView">',  'check we are at home');
        
        $this->assertNoUnwantedPattern('/cia/i');
        $this->assertNoUnwantedPattern('/manhatten/i');
        $this->assertNoUnwantedPattern('/manhatten/i');

        ### check admin view
        $this->assertTrue( $this->clickLink('admin'));
        $this->assertNoUnwantedPattern('/<x>/');
        $this->assertNoUnwantedPattern('/&amp;lt;x&amp;gt;/',     'check double escaped data (%s)');
        $this->assertValidHtmlStucture("admin person view");

        ### logout  ###
        # Note: Stalin speaks German :)
        $this->assertTrue( $this->clickLink('Abmelden'));


        $this->assertWantedPattern('/anmelden/i',                                            'check content (%s)');
        $this->assertValidHtmlStucture('login');
    }


    function testRoosevelt() {

        TestEnvironment::prepare('fixtures/project_setup.sql');
        $this->addHeader('USER_AGENT: streber_unit_tester');

        $g_streber_url= "http://localhost/streber_head";

        ### logout first ###
        $this->assertTrue($this->get("$g_streber_url"), 'getting login page (%s)' );
        $this->assertWantedPattern('/please login/i',                                            'check content (%s)');
        $this->assertValidHtmlStucture('login');

        ### Test login working ###
        $this->assertTrue( $this->setField('login_name', 'roosevelt'));
        $this->assertTrue( $this->setField('login_password', 'roosevelt_secret') );
        $this->assertTrue( $this->clickSubmit('Submit'));
        #$this->assertValidHtmlStucture('login');
        validatePage($this);

        #$this->assertNoUnwantedPattern('/Warning:|Error:|Notice:/i',    'php-error found (%s)' );
        $this->assertNoUnwantedPattern('/invalid login/i',  'check content (%s)');
        $this->assertNoUnwantedPattern('/insufficient/i',  'check content (%s)');

        $this->assertWantedPattern('<body class="projView">',  'check we are at home');
        
        $this->assertWantedPattern('/cia/i');
        $this->assertWantedPattern('/manhatten/i');

        #$this->showSource();
        foreach( split(",", "admin,pm,alan,bob,we will win,big news") as $p) {
            $this->assertWantedPattern('/' . $p . '/i');
        }
        #foreach( split(",", "error_list") as $p) {
        #    $this->assertWantedPattern('/' . $p . '/i');
        #}
    
        ### View topics ###
        $this->assertTrue( $this->clickLink('Topics'));
        validatePage($this);

        ### View one topic ###
        $this->assertTrue( $this->clickLink('why i love the bomb'));
        $this->assertNoUnwantedPattern('/Book Effort/i',  'Roosevelt does not like efforts (%s)');

        ### logout  ###
        $this->assertTrue( $this->clickLink('Logout'));

        $this->assertWantedPattern('/please login/i',                                            'check content (%s)');
        $this->assertValidHtmlStucture('login');
    }


    function testEditTasks()
    {

        TestEnvironment::prepare('fixtures/project_setup.sql');
        $this->addHeader('USER_AGENT: streber_unit_tester');

        global $g_streber_url;
        $g_streber_url= "http://localhost/streber_head";

        ### login as bob ###
        $this->assertTrue($this->get($g_streber_url),       'getting login page (%s)' );
        $this->assertTrue( $this->setField('login_name',    'bob'));
        $this->assertTrue( $this->setField('login_password','bob_secret') );
        $this->assertTrue( $this->clickSubmit('Submit'));
        validatePage($this);

        ### View topics ###
        #$this->assertTrue( $this->clickLink('Topics'));
        #validatePage($this);

        ### View one topic ###
        $this->assertTrue( $this->clickLink('we will win'));

        ### Add comment ###
        $this->assertTrue( $this->setField('comment_name',    'comment by bob <x>'));
        $this->assertTrue( $this->setField('comment_description','description <x>') );
        $this->assertTrue( $this->clickSubmit('Submit'));

        $this->assertText( "Changed Topic");        
        $this->assertText( "comment by bob");        
        $this->assertText( "description");        

        ### Go to project page ###
        $this->assertTrue( $this->clickLink('m <x>'));
        validatePage($this);
        $this->assertText('News',                       'make sure news still there(%s)');
        $this->assertText('1 comments',                 'make sure news still there(%s)');
        $this->assertText('Add comment',                'make sure news still there(%s)');

        ### logout  ###
        $this->assertTrue( $this->clickLink('Logout'));

        $this->assertWantedPattern('/please login/i',                       'check content (%s)');
        $this->assertValidHtmlStucture('login');
    }

}





?>
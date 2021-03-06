/**
 * all jquery-functions, no special relation
 *
 * is been called on load
 *
 * included by:
 *
 * @author     Tino Beirau
 * @uses:
 * @usedby:
 */

/**
* global variables
*/
var onLoadFunctions= new Array();
var ajax_edits= new Array();


/**
* called after loading
*/
function misc()
{
    //updateTimetrackingTable();


    /*******************************************************
    * Form - visual effects
    *
    */

    /**
    * chose between current or next project in notes on person dialog
    * show and hide project list / project input field
    */
    $('body.taskNoteOnPersonEdit #new_project').click
    (
        function(e)
        {
            if(this.checked)
            {
                $('div.form #proj_list').slideUp('300');
                $('div.form #proj_new_input').slideDown('300');
            }
            else
            {
                $('div.form #proj_new_input').slideUp('300');
                $('div.form #proj_list').slideDown('300');
            }
        }
    );


    /**
    * toggle between different tabgroups
    */
    TabGroup = {
      init: function() {
        $('div.tabgroup').each(function(){
          var f = TabGroup.click;
          var group = this;
          $('.tab_header', group).each(function(){
            this.group = group;
            $(this).click(f);
            $('#'+this.id+'-body').addClass('Hidden');
          }).filter(':first').trigger('click');
        });
        $('.tabgroup ul li:first').addClass('Active');
        $('.tabgroup div:first').removeClass('Hidden');
      },

      click: function(e) {
        var tab = $('#'+this.id+'-body').get(0);

        $('.tab_header', this.group).each(function(){
          $(this).removeClass('Active');
          $('#'+this.id+'-body').addClass('Hidden');
        });
        $(this).addClass('Active');

        $(tab).removeClass('Hidden');
        e.preventDefault();
      }
    };
    TabGroup.init();


    /**
    * in taskEdit hide and show tabs depending on task category
    */
    TaskEditTabs = {
        init:function() {
            $('select#task_category').change(function(e) {
                switch(this.value) {

                    //--- task ---
                    case '0':
                        $('div.tabgroup li#task').show();
                        $('div.tabgroup li#bug').hide();
                        $('div.tabgroup li#timing').show();
                        $('div.tabgroup li#task').trigger('click');
                        break;

                    //--- bug ---
                    case '1':
                        $('div.tabgroup li#task').show();
                        $('div.tabgroup li#bug').show();
                        $('div.tabgroup li#timing').show();
                        $('div.tabgroup li#task').trigger('click');
                        break;

                    //--- documentation ---
                    case '2':
                        $('div.tabgroup li#task').hide();
                        $('div.tabgroup li#bug').hide();
                        $('div.tabgroup li#timing').hide();
                        $('div.tabgroup li#description').trigger('click');
                        break;

                    //--- folder ---
                    case '3':
                        $('div.tabgroup li#task').show();
                        $('div.tabgroup li#bug').hide();
                        $('div.tabgroup li#timing').show();
                        $('div.tabgroup li#description').trigger('click');
                        break;

                   //--- event ---
                    case '4':
                        $('div.tabgroup li#task').show();
                        $('div.tabgroup li#bug').hide();
                        $('div.tabgroup li#timing').show();
                        $('div.tabgroup li#description').trigger('click');
                        break;

                   //--- milestone ---
                    case '10':
                        $('div.tabgroup li#task').show();
                        $('div.tabgroup li#bug').hide();
                        $('div.tabgroup li#timing').show();
                        $('div.tabgroup li#description').trigger('click');
                        break;

                  //--- version ---
                    case '11':
                        $('div.tabgroup li#task').show();
                        $('div.tabgroup li#bug').hide();
                        $('div.tabgroup li#timing').show();
                        $('div.tabgroup li#description').trigger('click');
                        break;
                }
            });
        }
    }
    TaskEditTabs.init();
    $('select#task_category').trigger('change');

    /**
    * project selector
    */
    $('span#projectselector').click(function() {
        $('span#projectselectorlist').toggle();
    });

    /**
    * home selector
    */
    $('span#homeselector').click(function() {
        $('span#homeselectorlist').toggle();
    });

    /**
    * call onload functions
    */
    for(i=0; i < onLoadFunctions.length; i++) {
        onLoadFunctions[i]();
    }

    /**
    * init ajaxEdits
    */
    $('div.wiki.editable').each(function() {
        aj= new AjaxEdit(this);
        ajax_edits.push(aj);
        this.ajax_edit= aj;
    });    
}

/**
* load additional changes for dashboard
*
* - called directly from home.inc.php -> home() javascript in ahref
*/

function getMoreChanges(project, start, count)
{
    var element= $('ul#changesOnProject_' + project);

    // initialize or update static variables
    if(!this.starts) {
        this.starts = Array();
    }       
        
    if(this.starts[project]) {
        start= this.starts[project] + count;
    }
    this.starts[project] = start;
            
    $.get("index.php",
        { go:'ajaxMoreChanges', start: start, count: count, prj:project },
        function(data) {
            $(element).append(data);
        }
    );
    return;
}


/**
* add inline edit functions for wiki chapters
* 
* read more documentation at http://www.streber-pm.org/3695
*/
function AjaxEdit(dom_element, item_id, field)
{
    this.dom_element    = dom_element;
    this.item_id        = item_id || 0;
    this.field          = field || 0;

    if(!dom_element)
        return;

    if($(dom_element).attr('item_id')) {
        item_id= $(dom_element).attr('item_id');
    }
    else {
        alert("Warning: no item id for ajax editing!");
        return;
    }

    if(dom_element.attributes['field_name']) {
        field_name= dom_element.attributes['field_name'].value;
    }
    else {
        field_name= "description";
    }

    this.initEditChapters = function()
    {
        if(!dom_element) {
            alert("no dom element");
            return;
        }

        var chapter_count= 0;
        $(dom_element).find('div.chapter').each(function() {
            var chapter= this;

            var children= $(this).children();

            var chapter_name= chapter_count++;


            $(this).addClass('edit_chapter');
            $(this).attr('title', 'Doubleclick to edit chapter');

            $(this).editable('index.php?go=itemSaveField&item=' + item_id + '&field=' + field_name + '&chapter=' + chapter_name, {
                loadurl:'index.php?go=itemLoadField&item=' + item_id + '&field=' + field_name + '&chapter=' + chapter_name,
                type:'textarea',
                submit:'Save',
                cancel:'Cancel',
                chapter:true,
                obj:dom_element,
                placeholder:'',
                onblur:'ignore',
                event:'dblclick',
                callback:function(value, settings){
                  keepParentNode = this.parentNode
                  $(this.parentNode).html( value );
                  keepParentNode.ajax_edit.initEditChapters();
                }
            });
        });
    }
    this.initEditChapters();
}

/**
* initialize handlers for autocompletion input fields on startup
* 
* Called by render_page js-code if page->use_autocomplete enabled
*/
function initAutocompleteFields() {
    $("input.autocomplete").each(function() {
        if($(this).attr('autocomplete_list')) {
            var autocomplete_list= $(this).attr('autocomplete_list');
            $(this).autocomplete(autocomplete_list.split(','), {
                delay: 150,
                selectFirst: false,
                multiple: true,
                //mustMatch: true,
                autoFill: true
              });
        }
    });
}



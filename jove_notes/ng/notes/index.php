<?php
require_once( $_SERVER[ "DOCUMENT_ROOT" ] . "/apps/jove_notes/php/app_bootstrap.php" ) ;

$pageConfig = array(
	"tab_title"  => "Chapter Notes"
) ;

define( "HTML_FRAGMENT_PATH",   "/apps/jove_notes/ng/notes/html_fragments" ) ;
define( "WM_FRAGMENT_PATH",     HTML_FRAGMENT_PATH . "/wm_template.html" ) ;
define( "QA_FRAGMENT_PATH",     HTML_FRAGMENT_PATH . "/qa_template.html" ) ;
define( "FIB_FRAGMENT_PATH",    HTML_FRAGMENT_PATH . "/fib_template.html" ) ;
define( "FILTER_FRAGMENT_PATH", HTML_FRAGMENT_PATH . "/filter_template.html" ) ;

define( "PHP_FRAGMENT_PATH",    DOCUMENT_ROOT . "/apps/jove_notes/ng/notes/php_fragments" ) ;
define( "NAVBAR_FRAGMENT_PATH", PHP_FRAGMENT_PATH . "/notes_navbar.php" ) ;
?>
<!DOCTYPE html>
<html ng-app="notesApp">
<head>
    <?php include( HEAD_CONTENT_FILE ); ?>
    <style>
    </style>
    <script src="/apps/jove_notes/ng/notes/routes.js"></script>    
    <script src="/apps/jove_notes/ng/notes/controllers.js"></script>    
</head>
<body ng-controller="NotesController">
    <?php include( NAVBAR_FRAGMENT_PATH ) ; ?>
    <?php include( ALERT_DIV_FILE ) ; ?>
    <div ng-show="showFilterForm" ng-include="'<?php echo FILTER_FRAGMENT_PATH ?>'">
    </div>
    <p>
    <div ng-if="wordMeanings.length">
        <div ng-include="'<?php echo WM_FRAGMENT_PATH ?>'">
        </div>
    </div>

    <div ng-if="fibs.length">
        <div ng-include="'<?php echo FIB_FRAGMENT_PATH ?>'">
        </div>
    </div>

    <div ng-if="questionAnswers.length">
        <div ng-include="'<?php echo QA_FRAGMENT_PATH ?>'">
        </div>
    </div>

</body>
</html>
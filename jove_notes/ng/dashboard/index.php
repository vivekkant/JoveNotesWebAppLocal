<?php
require_once( $_SERVER[ "DOCUMENT_ROOT" ] . "/apps/test_app/php/app_bootstrap.php" ) ;

$pageConfig = array(
	"tab_title"  => "Dashboard",
    "page_title" => "Study Dashboard",
) ;
?>
<!DOCTYPE html>
<html ng-app="dashboardApp">
<head>
    <?php include( HEAD_CONTENT_FILE ) ; ?>
    <style>
    .icon-bar {
    	background-color: black;
	}	
    </style>
    <link rel="stylesheet" href="/lib-ext/jquery/css/jquery.treegrid.css">
	<script src="/lib-ext/jquery/jquery.treegrid.js"></script>
	<script src="/lib-ext/jquery/jquery.treegrid.bootstrap3.js"></script>    

	<script src="/apps/jove_notes/ng/dashboard/utils.js"></script>    
	<script src="/apps/jove_notes/ng/dashboard/routes.js"></script>    
	<script src="/apps/jove_notes/ng/dashboard/controllers.js"></script>    
	<script src="/apps/jove_notes/ng/dashboard/directives.js"></script>    
	<script src="/apps/jove_notes/ng/dashboard/progress_snapshot/controllers.js"></script>    
	<script src="/apps/jove_notes/ng/dashboard/study_per_day/controllers.js"></script>    
</head>
<body ng-controller="DashboardController">
    <?php include( NAVBAR_FILE ) ; ?>

    <a type="button" class="btn btn-default btn-md" 
       href="#ProgressSnapshot"
       ng-class="getBtnActiveClass( 'ProgressSnapshot' )"
       ng-click="setActiveReport( 'ProgressSnapshot' )">
	Progress Snapshot
	</a>

    <a type="button" class="btn btn-default btn-md" 
       href="#StudyPerDay" 
       ng-class="getBtnActiveClass( 'StudyPerDay' )"
       ng-click="setActiveReport( 'StudyPerDay' )">
	Study per Day
	</a>
	<p>
	<div class="ng-view"></div>	
</body>
</html>
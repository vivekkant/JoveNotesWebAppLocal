<a name="top"></a>

<div class="container-fluid">
  <div class="row">
    <div class="col-sm-8 nav_element">
        <img src="<?php echo APP_LOGO_PATH ?>" 
             style="height: 30px"/>
        &nbsp;&nbsp;&nbsp;
        <b>{{pageTitle}}</b>
    </div>
    <div class="col-sm-4 nav_element">
        <span class="small">
        [ <?php echo ExecutionContext::getCurrentUserName(); ?> ]
        </span>
        <div class="pull-right" style="margin-top: 3px">
            <a target="_blank" href="/apps/jove_notes/ng/notes/practice.php?chapterId=<?php echo $_REQUEST[ 'chapterId' ] ?>">
                <span class="glyphicon glyphicon-edit gi-1-5x"></span>
            </a>
            &nbsp;
            <a target="_blank" href="/apps/jove_notes/ng/notes/print.php?chapterId=<?php echo $_REQUEST[ 'chapterId' ] ?>">
                <span class="glyphicon glyphicon-print gi-1-5x"></span>
            </a>
            &nbsp;
            <a ng-click="toggleFilterForm()">
                <span class="glyphicon glyphicon-filter gi-1-5x"></span>
            </a>
            &nbsp;
            <a ng-click="toggleUserStatistics()">
                <span class="glyphicon glyphicon-screenshot gi-1-5x"></span>
            </a>
            &nbsp;
            <a href="/apps/jove_notes/ng/dashboard/index.php">
                <span class="glyphicon glyphicon-eye-open gi-1-5x"></span>
            </a>
        </div>
    </div>
  </div>
</div>

<div class="floating_notes_menu">
    <a ng-click="scrollTo('top')">
        <span class="glyphicon glyphicon-arrow-up gi-2x"></span>
    </a>
    <p>
    <a ng-click="toggleUserStatistics()">
        <span class="glyphicon glyphicon-screenshot gi-2x"></span>
    </a>
    <p>
    <a href="/apps/jove_notes/ng/dashboard/index.php">
        <span class="glyphicon glyphicon-eye-open gi-2x"></span>
    </a>
</div>



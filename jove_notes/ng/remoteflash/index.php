<?php
require_once( $_SERVER[ "DOCUMENT_ROOT" ] . "/apps/jove_notes/php/app_bootstrap.php" ) ;
require_once( DOCUMENT_ROOT . "/apps/jove_notes/php/dao/chapter_dao.php" ) ;

// Check if the user has access to use remote flash card feature
if( !Authorizer::hasAccess( "feature:RemoteFlash", "USE" ) ) {
    HTTPUtils::redirectTo( ServerContext::getUnauthRedirPage() ) ;
    return ;
}

$pageConfig = array(
	"tab_title"  => "Remote Flash Client"
) ;

?>
<!DOCTYPE html>
<html ng-app="remoteFlashCardApp">

<head>
    <?php include( HEAD_CONTENT_FILE ); ?>

    <style>
        .jumbotron {
            background: #000 ;
            color: #C2C2C2;
        }    
    </style>

    <script type="text/x-mathjax-config">
      MathJax.Hub.Config({ TeX: { extensions: ["mhchem.js"] }});
    </script>
    <script type="text/javascript" src="/lib-ext/MathJax/MathJax.js?config=TeX-AMS-MML_HTMLorMML"></script>

    <link rel='stylesheet' href='/apps/jove_notes/ng/flashcard/flashcard.css'>

    <script src="/lib-ext/rgraph/RGraph.common.core.js"></script>    
    <script src="/lib-ext/rgraph/RGraph.common.key.js"></script>    
    <script src="/lib-ext/rgraph/RGraph.line.js"></script>    
    <script src="/lib-ext/rgraph/RGraph.pie.js"></script>    
    <script src="/lib-ext/rgraph/RGraph.bar.js"></script>    

    <script src="/apps/jove_notes/ng/_common/jove_notes_utils.js"></script>    
    <script src="/apps/jove_notes/ng/_common/question_utils.js"></script>    

    <script src="/apps/jove_notes/ng/flashcard/practice_page/question_handlers.js"></script>    
    <script src="/apps/jove_notes/ng/flashcard/practice_page/dynq_matching.js"></script>    
    <script src="/apps/jove_notes/ng/flashcard/practice_page/dynq_imglabel.js"></script>    
    <script src="/apps/jove_notes/ng/flashcard/practice_page/dynq_spellbee.js"></script>    

    <script src="/apps/jove_notes/ng/remoteflash/routes.js"></script>    
    <script src="/apps/jove_notes/ng/remoteflash/controllers.js"></script>    

    <script>
    var userName  = '<?php echo ExecutionContext::getCurrentUserName() ?>' ;
    </script>
</head>

<body ng-controller="RemoteFlashCardController">
    <?php include( ALERT_DIV_FILE ) ; ?>
    <audio id="audio"></audio>
    <div ng-show="currentScreen == SCREEN_WAITING_TO_START" class="ng-hide"
         ng-include="'/apps/jove_notes/ng/remoteflash/fragments/waiting_to_start.html'">
    </div>
    <div ng-show="currentScreen == SCREEN_SESSION_SETTINGS" class="ng-hide"
         ng-include="'/apps/jove_notes/ng/remoteflash/fragments/session_settings.html'">
    </div>
    <div ng-show="currentScreen == SCREEN_PRACTICE" class="ng-hide"
         ng-include="'/apps/jove_notes/ng/remoteflash/fragments/session_practice.html'">
    </div>
    <div ng-show="currentScreen == SCREEN_SESSION_END" class="ng-hide"
         ng-include="'/apps/jove_notes/ng/remoteflash/fragments/session_end.html'">
    </div>
</body>

</html>
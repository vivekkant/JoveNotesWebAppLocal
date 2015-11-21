flashCardApp.controller( 'FlashCardController', function( $scope, $http, $location ) {
// ---------------- Constants and inner class definition -----------------------
function StudyCriteria() {
    
    this.maxCards    = 10000 ;
    this.maxTime     = -1 ;
    this.maxNewCards = 10000 ;

    this.currentLevelFilters       = [ "L0", "L1", "L2", "L3"                  ] ;
    this.learningEfficiencyFilters = [ "A1", "A2", "B1", "B2", "C1", "C2", "D" ] ;
    this.difficultyFilters         = [ "VE", "E",  "M",  "H",  "VH"            ] ;
    this.cardTypeFilters           = [] ;

    this.strategy      = "SSR" ;
    this.push          = false ;
    this.assistedStudy = false ;

    this.setDefaultCriteria = function() {
        this.currentLevelFilters       = [ "L0", "L1", "L2", "L3"                  ] ;
        this.learningEfficiencyFilters = [ "A1", "A2", "B1", "B2", "C1", "C2", "D" ] ;
        this.difficultyFilters         = [ "VE", "E",  "M",  "H",  "VH"            ] ;
    }

    this.serialize = function() {
        $.cookie.json = true ;
        $.cookie( 'studyCriteria', this, { expires: 30 } ) ;
    }

    this.deserialize = function() {
        $.cookie.json = true ;
        var crit = $.cookie( 'studyCriteria' ) ;
        if( typeof crit != 'undefined' ) {
            this.maxCards    = crit.maxCards ;
            this.maxTime     = crit.maxTime ;
            this.maxNewCards = crit.maxNewCards ;

            this.currentLevelFilters       = crit.currentLevelFilters ;
            this.learningEfficiencyFilters = crit.learningEfficiencyFilters ;
            this.difficultyFilters         = crit.difficultyFilters ;

            this.strategy      = crit.strategy ;
            this.push          = crit.push ;
            this.assistedStudy = crit.assistedStudy ;
        } ;
    }

    this.matchesFilter = function( question ) {

        var currentLevel = question.learningStats.currentLevel ;
        var lrnEffLabel  = question.learningStats.efficiencyLabel ;
        var diffLabel    = question.difficultyLabel ;
        var elementType  = question.elementType ;

        var currentLevelFilters = this.currentLevelFilters ;
        var lrnEffLabelFilters  = this.learningEfficiencyFilters ;
        var diffLabelFilters    = this.difficultyFilters ;
        var cardTypeFilters     = this.cardTypeFilters ;

        if( cardTypeFilters.indexOf( elementType ) != -1 ) {
            if( currentLevelFilters.indexOf( currentLevel ) != -1 ) {
                if( lrnEffLabelFilters.indexOf( lrnEffLabel ) != -1 ) {
                    if( diffLabelFilters.indexOf( diffLabel ) != -1 ) {
                        return true ;
                    }
                    else {
                        log.debug( "\t\tRejecting Q" + question.questionId + 
                                   " : Difficulty level filter mismatch. " + diffLabel ) ;
                    }
                }
                else {
                    log.debug( "\t\tRejecting Q" + question.questionId + 
                               " : Learning efficiency filter mismatch. " + lrnEffLabel ) ;
                }
            }
            else {
                log.debug( "\t\tRejecting Q" + question.questionId + 
                           " : Current level filter mismatch. " + currentLevel ) ;
            }
        }
        else {
            log.debug( "\t\tRejecting Q" + question.questionId + 
                       " : Card type filter mismatch. " + elementType ) ;
        }
        return false ;
    }
}

// ---------------- Local variables --------------------------------------------
var jnUtil = new JoveNotesUtil() ;

// ---------------- Controller variables ---------------------------------------
$scope.alerts = [] ;

$scope.userName  = userName ;
$scope.chapterId = chapterId ;
$scope.chapterIdsForNextSessions = null ;

if( chapterIdsForNextSessions != null ) {
    $scope.chapterIdsForNextSessions = chapterIdsForNextSessions.join() ;
}

$scope.pageTitle = '' ;

$scope.studyCriteria = new StudyCriteria() ;
$scope.filterOptions = new CardsFilterOptions() ;

$scope.sessionId              = sessionId ;
$scope.chapterDetails         = null ;
$scope.numCardsInDeck         = 0 ;
$scope.difficultyStats        = null ;
$scope.progressSnapshot       = null ;
$scope.difficultyTimeAverages = null ;
$scope.learningCurveData      = null ;
$scope.questions              = null ;

$scope.pointsEarnedInThisSession = 0 ;
$scope.pointsLostInThisSession = 0 ;

$scope.sessionStats = {
    numCards         : 0,
    numCardsLeft     : 0,
    numCardsAnswered : 0
} ;

$scope.sessionDuration = 0 ;
$scope.timePerQuestion = 0 ;

$scope.messageForEndPage = "Session Ended." ;

$scope.assistedStudyCBDisabled = false ;

$scope.textFormatter = null ;

$scope.cardTypeHistogram = [] ;

// ---------------- Main logic for the controller ------------------------------
log.debug( "Executing FlashCardController." ) ;

$scope.studyCriteria.deserialize() ;

// -------------Scope watch functions ------------------------------------------
$scope.initialDigestProcess = true ;
$scope.$watch( 'studyCriteria.push', function( newValue, oldValue ){
    if( $scope.initialDigestProcess ) {
        $scope.initialDigestProcess = false ;
    }
    else {
        $scope.studyCriteria.assistedStudy = newValue ;
        $scope.assistedStudyCBDisabled = ( newValue == true ) ;
    }
}) ;

// ---------------- Controller methods -----------------------------------------
$scope.resumeSession = function() {
    $scope.$broadcast( 'resumeSession.button.click' ) ;
}

$scope.addErrorAlert = function( msgString ) {
    $scope.alerts.push( { type: 'danger', msg: msgString } ) ;
}

$scope.closeAlert = function(index) {
    $scope.alerts.splice( index, 1 ) ;
};

$scope.purgeAllAlerts = function() {
    log.debug( "Purging all alerts" ) ;
    $scope.alerts.length = 0 ;
}

$scope.processServerData = function( serverData ) {

    if( typeof serverData === "string" ) {
        $scope.addErrorAlert( "Server returned invalid data. " + serverData ) ;
        return ;
    }

    log.debug( "Session id = " + $scope.sessionId ) ;
    
    $scope.chapterDetails         = serverData.chapterDetails ;
    $scope.numCardsInDeck         = serverData.deckDetails.numCards ;
    $scope.difficultyStats        = serverData.deckDetails.difficultyStats ;
    $scope.progressSnapshot       = serverData.deckDetails.progressSnapshot ;
    $scope.difficultyTimeAverages = serverData.deckDetails.difficultyTimeAverages ;
    $scope.learningCurveData      = serverData.deckDetails.learningCurveData ;
    $scope.questions              = serverData.questions ;
    $scope.pageTitle              = jnUtil.constructPageTitle( $scope.chapterDetails ) ;
    $scope.textFormatter          = new TextFormatter( $scope.chapterDetails, null ) ;

    preProcessFlashCardQuestions( $scope.questions ) ;
    prepareCardTypeOptions() ;
}
// ---------------- Private functions ------------------------------------------

function preProcessFlashCardQuestions( questions ) {

    for( i=0; i<questions.length; i++ ) {

        var question = questions[i] ;

        question.learningStats.numAttemptsInSession = 0 ;
        question.learningStats.numSecondsInSession  = 0 ;
        
        question.difficultyLabel = 
            jnUtil.getDifficultyLevelLabel( question.difficultyLevel ) ;

        question.learningStats.efficiencyLabel = 
            jnUtil.getLearningEfficiencyLabel( question.learningStats.learningEfficiency ) ;

        question.learningStats.absoluteLearningEfficiency = 
            jnUtil.getAbsoluteLearningEfficiency( question.learningStats.temporalScores ) ;

        question.learningStats.averageTimeSpent = 0 ;
        if( question.learningStats.numAttempts != 0 ) {
            question.learningStats.averageTimeSpent = Math.ceil( question.learningStats.totalTimeSpent / 
                                                                 question.learningStats.numAttempts ) ;
        }

        question.scriptObj = jnUtil.makeObjectInstanceFromString( 
                                    question.scriptBody,
                                    $scope.textFormatter.getChapterScript() ) ;

        associateHandler( question ) ;
        processTestDataHints( question ) ;
        collateQuestionTypeHistogram( question ) ;
    }
}

function associateHandler( question ) {

    var questionType = question.questionType ;

    if( questionType == QuestionTypes.prototype.QT_FIB ) {
        question.handler = new FIBHandler( $scope.chapterDetails, question, 
                                           $scope.textFormatter ) ;
    }
    else if( questionType == QuestionTypes.prototype.QT_QA ) {
        question.handler = new QAHandler( $scope.chapterDetails, question, 
                                          $scope.textFormatter ) ;
    }
    else if( questionType == QuestionTypes.prototype.QT_TF ) {
        question.handler = new TFHandler( $scope.chapterDetails, question,
                                          $scope.textFormatter ) ;
    }
    else if( questionType == QuestionTypes.prototype.QT_MATCHING ) {
        question.handler = new MatchingHandler( $scope.chapterDetails, question, 
                                                $scope.textFormatter ) ;
    }
    else if( questionType == QuestionTypes.prototype.QT_IMGLABEL ) {
        question.handler = new ImageLabelHandler( $scope.chapterDetails, question, 
                                                  $scope.textFormatter ) ;
    }
    else if( questionType == QuestionTypes.prototype.QT_SPELLBEE ) {
        question.handler = new SpellBeeHandler( $scope.chapterDetails, question, 
                                                $scope.textFormatter ) ;
    }
    else if( questionType == QuestionTypes.prototype.MULTI_CHOICE ) {
        question.handler = new MultiChoiceHandler( $scope.chapterDetails, question, 
                                                   $scope.textFormatter ) ;
    }
    else {
        log.error( "Unrecognized question type = " + questionType ) ;
        throw "Unrecognized question type. Can't associate formatter." ;
    }
}

function collateQuestionTypeHistogram( question ) {

    var elementType = question.elementType ;

    if( $scope.cardTypeHistogram.hasOwnProperty( elementType ) ) {
        $scope.cardTypeHistogram[ elementType ]++ ;
    }
    else {
        $scope.cardTypeHistogram[ elementType ] = 1 ;
    }

    log.debug( elementType + " = " + $scope.cardTypeHistogram[ elementType ] ) ;
}

function processTestDataHints( question ) {

    if( question.learningStats.hasOwnProperty( '_testLATLag' ) ) {
        var numMillisLag = question.learningStats._testLATLag * 24 * 60 * 60 * 1000 ;
        question.learningStats.lastAttemptTime = new Date().getTime() + numMillisLag ;
    }
}

function prepareCardTypeOptions() {

    for( var elementType in $scope.cardTypeHistogram ) {
        if( $scope.cardTypeHistogram.hasOwnProperty( elementType ) ) {
            var count = $scope.cardTypeHistogram[ elementType ] ;
            if( count > 0 ) {

                var name = 'Unknown Element' ;
                if( elementType == "word_meaning" ) {    
                    name = "Word Meaning" ;
                }
                else if( elementType == "question_answer" ) { 
                    name = "Question Answer" ;
                }
                else if( elementType == "fib" ) {             
                    name = "Fill in the blanks" ;
                }
                else if( elementType == "definition" ) {      
                    name = "Definition" ;
                }
                else if( elementType == "character" ) {       
                    name = "Character" ;
                }
                else if( elementType == "matching" ) {        
                    name = "Matching" ;
                }
                else if( elementType == "event" ) {           
                    name = "Event" ;
                }
                else if( elementType == "true_false" ) {      
                    name = "True False" ;
                }
                else if( elementType == "chem_equation" ) {   
                    name = "Chemical Equation" ;
                }
                else if( elementType == "chem_compound" ) {   
                    name = "Chemical Compound" ;
                }
                else if( elementType == "spellbee" ) {        
                    name = "Spellbee" ;
                }
                else if( elementType == "image_label" ) {     
                    name = "Image label" ;
                }
                else if( elementType == "equation" ) {        
                    name = "Equation" ;
                }
                else if( elementType == "rtc" ) {             
                    name = "Reference to context" ;
                }
                else if( elementType == "multi_choice" ) {    
                    name = "Multiple choice" ;
                }

                var optionString = "" + count ;
                var pad = "000" ;
                optionString = pad.substring( 0, pad.length - optionString.length ) + optionString ;
                optionString = optionString + " - " + name ;

                $scope.filterOptions.cardTypeOptions.push( {
                    id : elementType,
                    name : optionString,
                    count : count
                }) ;

                $scope.studyCriteria.cardTypeFilters.push( elementType ) ;
            }
        }
    }

    $scope.filterOptions.cardTypeOptions.sort( function( a, b ){ 
        return b.count - a.count ; 
    } ) ;
}

// ---------------- End of controller ------------------------------------------
} ) ;




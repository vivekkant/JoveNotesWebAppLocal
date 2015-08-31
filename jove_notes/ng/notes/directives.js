notesApp.directive( 'renderImageLabel', function( $sce ) {

	return {
		restrict : 'E',
		link : function( $scope, element, attributes ) {

			var textFormatter = new TextFormatter( $scope.$parent.$parent.$parent.chapterDetails, $sce ) ;
			var handler = new ImageLabelManager( $scope.element, textFormatter, $scope )

			handler.initialize() ;
			var answerUI = handler.getAnswerUI() ;
			element.empty() ;
			element.append( answerUI ) ;
			MathJax.Hub.Queue( ["Typeset", MathJax.Hub, answerUI] ) ;
        }
	} ;
}) ;

notesApp.directive( 'renderPracticeImageLabel', function( $sce ) {

	return {
		restrict : 'E',
		link : function( $scope, element, attributes ) {

			var textFormatter = new TextFormatter( $scope.$parent.$parent.$parent.chapterDetails, $sce ) ;
			var handler = new ImageLabelManager( $scope.element, textFormatter, $scope )

			handler.initialize() ;
			var questionUI = handler.getQuestionUI() ;
			recurseAndCleanHanlders( questionUI ) ;
			element.empty() ;
			element.append( questionUI ) ;
			MathJax.Hub.Queue( ["Typeset", MathJax.Hub, questionUI] ) ;

			function recurseAndCleanHanlders( obj ) {
				if( 'onclick' in obj ) {
					obj.onclick = null ;
				}
			    if( obj.hasChildNodes() ) {
			        var child = obj.firstChild ;
			        while( child ) {
			        	recurseAndCleanHanlders( child ) ;
			            child = child.nextSibling;
			        }
			    }
			}
        }
	} ;
}) ;
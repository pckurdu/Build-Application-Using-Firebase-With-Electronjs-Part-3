var app=angular.module('myApp',['ngRoute']);

app.config(function($routeProvider){
    $routeProvider
        .when('/',{
            templateUrl:'login.html',
            controller:'loginCtrl'
        })
        .when('/dashboard',{
            templateUrl:'dashboard.html',
            controller:'dashboardCtrl'
        })
        .otherwise({
            redirectTo:'/'
        })
});

app.controller('loginCtrl',function($scope,$location,$rootScope){

$rootScope.auth=false;//I created auth object from rootScope and set it to false as initial

    $scope.login=function(){//the function that will work when the login button is clicked

        auth.signInWithEmailAndPassword($scope.username,$scope.password).then((res)=>{//the function that controls the user in the firebase

            $rootScope.auth=true;
            console.log(res.user);
            $location.path('/dashboard');//if the user has a firebase, go to the dashboard page
        })

    }
    $scope.signup=function(){//the function that will work when the signup button is clicked

        auth.createUserWithEmailAndPassword($scope.username,$scope.password).then(res=>{//the function that adds user to firebase
            console.log(res.user);
            $rootScope.auth=true;
            $location.path('/dashboard');//if the user has a firebase, go to the dashboard page
        });
    }
});

app.controller('dashboardCtrl',function($rootScope,$scope,$location){

if($rootScope.auth==true){//checking user login.
  $scope.add=function(){

      db.collection('articles').add({//A collection of articles is being created and a document is added.
          title:$scope.title,
          content:$scope.content
      }).then(()=>{//success
          //console.log("Article successfully added");
      }).catch(err=>{//unsuccessful
          //console.log(err.message);

      })

  }

  var ul=document.getElementById('ul');//ul element to be added to the article list is captured.

  db.collection('articles').onSnapshot(snap=>{//Instant data is captured with onsnapshot
      console.log(snap.docs);
      var articles=snap.docs;//all documents in articles collection
      if(articles.length){
          let html='';//I will add all li tags into html
          articles.forEach(art=>{
              //console.log(belge);
              var a=art.data();//title and content fields of the document
              console.log(a);
              //each article is written to the variable li.
              var li=`<li class="list-group-item">${a.title}---${a.content}</li>`;
              html +=li;
          });
          ul.innerHTML=html;//Add li elements into ul
      }

  })
}

})

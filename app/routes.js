module.exports = {
  bind : function (app) {

  var fs = require('fs');


  // This builds the index navigation
	var services =  {
  		"services":[
	    	{ url: "property-possession", name: "Repossess a property" },
	    	{ url: "renew-passport", name: "Renew your passport"  },
	    	{ url: "apprenticeships", name: "Apply for an apprenticeship"  },
	    	{ url: "prison-visits", name: "Visit someone in prison"  },
	    	{ url: "registered-traveller", name: "Apply to be a registered traveller" },
	    	{ url: "redundancy-payments", name: "Claim redundancy payments"  },
	    	{ url: "vehicle-operators", name: "Apply for a vehicle operator’s licence" },
	    	{ url: "childminder", name: "Become a childminder" },
	    	{ url: "pip", name: "Personal Independence Payment" }
		]
	}


  // Render a page
  var renderPage = function(service, section, page, callback){

      // Read the data file for the relevant service
      var data = JSON.parse(fs.readFileSync('app/data/' + service + '.json', 'utf8'));

      // Get the section-level data for the page
      var pageData = data;
      sectionArray = section.split('/');

      // If the request contains sections
      if (sectionArray != ""){

        // Find the relevant section
        for(var i = 0; i < sectionArray.length; i++){

          var sectionIndex = Number(sectionArray[i]) - 1;

          // If it's the last section, add a flag so we can 
          // send people on to the next section
          var lastItem = false;
          if(sectionIndex + 1 == pageData.sections.length){
            lastItem = true;
          }

          var parentSection = pageData.name;

          pageData = pageData.sections[sectionIndex];
          pageData.lastItem = lastItem;
          pageData.parentSection = parentSection;

        }
      } else {
        pageData.lastItem2 = true;
      }


      // Number the current, previous and next pages
      var currentSection = Number(sectionArray[sectionArray.length - 1]);
      pageData.number = currentSection;
      pageData.next = currentSection + 1;
      pageData.prev = currentSection - 1;


      if (pageData.sections){

        // Number the sections
        for(var i = 0; i < pageData.sections.length; i++){

          // Number each section
          pageData.sections[i].number = i + 1;

          // Flag the last section
          if (i == pageData.sections.length - 1){
            pageData.sections[i].lastItem = true;
          } else {
            pageData.sections[i].lastItem = false; 
          }

          // If there are subsections
          if(pageData.sections[i].sections){
            for(var j = 0; j < pageData.sections[i].sections.length; j++){
              // Number each subsection
              pageData.sections[i].sections[j].number2 = j + 1;
            }    
          }  
        }  

        // If 1st section has subsections, assume they all do and
        // set flag so we can display the check page correctly
        if(pageData.sections[0].sections){
          pageData.subsections = true;
        }  

      }


      // Get the service-level data for the page
      pageData.service = data.service;


      // Don't show the service name in the header at the top level
      if(section == ""){
        pageData.service.name = "";
      } else {
        pageData.service.name = data.name;
        pageData.service.section = section.replace("/", ".");
      }

      return callback(null, pageData);

  }

  // ROUTES ================================== //


	// Index page

  app.get('/', function (req, res) {
    res.render('index', services);
  });


  // Service index page

  app.get("/service/:service/", function (req, res, next) {
    var service = req.params.service;
    renderPage(service, "", "start", function(error, data){
      return res.render('transaction-pages/start-page', data);
    })
  });


  // Service pages

  app.get("/service/:service/:page-page", function (req, res, next) {
    var service = req.params.service;
    var page = req.params.page;
    renderPage(service, "", page, function(error, data){


      return res.render('transaction-pages/' + page + '-page', data);



    })
  });


  // Section pages

  app.get("/service/:service/:section*/:subsections-page", function (req, res, next) {
    var service = req.params.service;
    var section = req.params.section;
    var subsections = req.params.subsections;
    var page = req.params[1];

    // Add subsections if there are any
    if(subsections){ section = section + subsections };

    renderPage(service, section, page, function(error, data){
      return res.render('transaction-pages/' + page + '-page', data);
    })

  });

  // AMLS Routes
  app.post('/:sprint/business-activities', function (req, res) {
    var activities = {
      'asp': {
        name : 'Accountancy service provider',
        url : 'asp-1'
      },
      'bpsp': {
        name : 'Bill payment service provider',
        url : 'bpsp-1'
      },
      'eab': {
        name : 'Estate agent business',
        url : 'eab-1'
      },
      'hvd': {
        name : 'High value dealer',
        url : 'hvd-1'
      },
      'msb': {
        name : 'Money service business',
        url : 'msb-1'
      },
      'tcsp': {
        name : 'Trust and company service provider',
        url : 'tcsp-1'
      },
      'tditpsp' : {
        name : 'Telephone, digital & IT payment service provider',
        url : 'tditsp-1'
      }
    };
    req.session.activities = [].concat(req.body.activities).map(function (e) {
        return activities[e];
    });
    res.redirect(req.params.sprint + '/summary');
  });
    
  app.get('/:sprint/summary', function (req, res) {
    console.log(req.session.activities);
    res.render(req.params.sprint + '/summary', {
      activities : req.session.activities
    });
  });
  
  }
};


////// AMLS Specifics /////

//var varActivityASP = '0',
//    varActivityBPSP = '0',
//    varActivityEAB = '0',
//    varActivityHVD = '0',
//    varActivityMSB = '0',
//    varActivityTCSP = '0',
//    varActivityTDITPSP = '0';


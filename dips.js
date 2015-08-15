(function(window){   
  
  var dips = function(){
    return new dips.prototype.init();    
  };// end of var dips

  var _this = '';
  var ruleList = [];

  dips.prototype = {
    init: function(){
      _this = this;
      //return _this;  // neccessary?
    },
    make_droppable: function(){
     $(".rules").droppable({
        over: function(){ 
          console.log(this); 
          //TODO: $(this).background color go bright

        },
        drop: function(e, ui){
          $(this).addClass("ui-state-highlight");
          if(ui.draggable.hasClass("blocks")) {
            $(this).append($(ui.helper).clone());

            //Add new class
            $(".rules .blocks").addClass("item-"+counts[0]);

            //Remove the current class (ui-draggable)
            $(".rules .item-"+counts[0]).removeClass("blocks ui-draggable ui-draggable-dragging");

            // remove when double click
            $(".item-"+counts[0]).dblclick(function() {
               $(this).remove();
            });

            // make draggable after dropping into droppable area
       	    _this.make_draggable($(".item-"+counts[0]));
          }
        }// end of drop
      });
    },
    make_draggable: function(elements){
      elements.draggable({
        containment:'parent',
          start:function(e,ui){ ui.helper.css('z-index',++zIndex); },
          stop:function(e,ui){}
        });
    }, // end of make_draggable
    make_rule: function(l, count){
      var rule = '';
      var state, effect, action1, action2, operator = '', otherwise = 0;
      var imports = 'import com.zgrannan.ubicomp._\n' +
                    'import Implicit._\n' +
                    'import Syntax._\n' +
                    'import edu.nccu.plsm.ubicomp.demo._\n' +
                    'import DemoDevice._\n' +
                    'import DemoAction._\n' + 
                    'import DemoEffect._\n' +
                    'import DemoState._\n\n';

      var ruleName = 'val Rule' + count + ':Rule = ';
      var action_count = 0;

      for( var i = 0; i < l.length; i++){
        // console.log(l[i].classList[0]);
        switch(l[i].classList[0]){
          case "states":
            states = l[i].innerHTML + ' ';
            break;
          case "actions":
            if(action_count == 0){
              action_count = 1;
              actions1 = l[i].innerHTML + ' ';
            } else {
              action2 = l[i].innerHTML + ' ';
              action_count = 0;
            }
            break;
          case "effects":
            effect = l[i].innerHTML + ' ';
            break;
          case "operators":
            operator = l[i].innerHTML + ' ';
            break;
          case "otherwise":
            otherwise = 1;
            break;
          default:
            break;
        }              
      }    

      rule = imports + ruleName + 'when(' + states + /* more states generator */
             ')' + actions1 + (otherwise ? 'otherwise' + action2 + ' ' : ' ') + 
             '\nlistener.instruct(Rule' + count + ')\n';

      return rule;
    },
    add_rule: function(){  
      var r = $('.newr'); // only one newr
      var l = r.children();
      var count = parseInt(r[0].id.split('-')[1]);
      var accumulator = count + 1;
      var rule = '';
      try{
        rule = _this.make_rule(l, count);
        $('#result').html(rule.replace(/\n/g, '<br>'));
        $('.editor').append('<div class="rules newr" id="rule-'+ accumulator + '"></div><br>');
        _this.make_droppable();
        r.removeClass('newr');
        r.css("background-color", "rgb(211,211,211)");
        ruleList.push(r[0].id);
      }catch(e){
        alert(e);
      }
    }// end of add_rule
  }// end of dips prototype

  dips.prototype.init.prototype = dips.prototype;
  window.dips = dips;

  //Make every clone image unique.
  var counts = [0];
  var resizeOpts = {
    handles: "all" ,autoHide:true
  };

  $(".blocks").draggable({
    revert: "invalid",
    helper: "clone",
    start: function() { counts[0]++; }  //Create counter
  });

  // finished a rule and add new rule input
  $('#new').click(dips().add_rule);

  // finised all rules and submit to engine
  $('#finish').click(function(){          
    for(var r in ruleList){
      console.log(ruleList[r]);
      /* final check if rule is changed */
      var l = $('#' + ruleList[r]).children();
      var count = ruleList[r].split('-')[1];
      var rule = '';
      rule = dips().make_rule(l, count);
      // console.log(rule);
      console.log($.get('http://localhost:12345', {rule: rule}));
    }
  });

  var zIndex = 0;
  
  dips().make_droppable();

})(window);
(function(window){   
  
  var dips = function(){
    return new dips.prototype.init();    
  };// end of var dips

  var _this = '';
  dips.prototype = {
    init: function(){
      console.log(123 + 'abc');
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
    add_rule: function(){    
      var r = $('.newr');
      var l = r.children();
      var count = parseInt(r[0].id.split('-')[1]);
      var accumulator = count + 1;
      var rule = '';
      var state, effect, action, operator = '', otherwise = 0;
      var imports = 'import com.zgrannan.ubicomp._\n' +
                    'import Implicit._\n' +
                    'import Syntax._\n' +
                    'import edu.nccu.plsm.ubicomp.demo._\n' +
                    'import DemoDevice._\n' +
                    'import DemoAction._\n' + 
                    'import DemoEffect._\n' +
                    'import DemoState._\n\n';

      var ruleName = 'val Rule' + count + ':Rule = ';

      for( var i = 0; i < l.length; i++){
        // console.log(l[i].classList[0]);
        switch(l[i].classList[0]){
          case "states":
            states = l[i].innerHTML + ' ';
            break;
          case "actions":
            actions = l[i].innerHTML + ' ';
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
      try{
        rule = imports + ruleName + 'when(' + states + /* more states generator */
               ')' + actions + /*(otherwise ? 'otherwise{' + action2 + '}' : ' ') */
               '\nlistener.instruct(Rule' + count + ')\n';
        $('#result').html(rule);
        r.removeClass('newr');
        $('.editor').append('<div class="rules newr" id="rule-'+ accumulator + '"></div><br>');
        _this.make_droppable();
      }catch(e){
        alert(e);
      }
    }// end of add_rule
  }// end of dips prototype

  dips.prototype.init.prototype = dips.prototype;
  window.dips = dips;

  console.log(123);

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
    console.log($.get('http://140.119.164.161:12345', { rule: $('#result').html()})); 
  });

  var zIndex = 0;
  
  dips().make_droppable();

})(window);
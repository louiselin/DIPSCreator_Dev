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

        function make_droppable(){
         $(".rules").droppable({
            drop: function(e, ui){
              if(ui.draggable.hasClass("blocks")) {
                $(this).append($(ui.helper).clone());

                 //Pointing to the dragImg class in dropHere and add new class.
                 $(".rules .blocks").addClass("item-"+counts[0]);

                //Remove the current class (ui-draggable and dragImg)
                $(".rules .item-"+counts[0]).removeClass("blocks ui-draggable ui-draggable-dragging");

                // remove when double click
                 $(".item-"+counts[0]).dblclick(function() {
                     $(this).remove();
                 });

                 // make draggable after dropping into droppable area
           	      make_draggable($(".item-"+counts[0]));
                }
              }// end of drop
            });
          }
           // finished a rule and add new rule input
           $('#new').click(add_rule);

           // finised all rules and submit to engine
           $('#finish').click(function(){          
             $.get('http://localhost:12345', { rule: $('footer').html()}); 
           });

           var zIndex = 0;
           function make_draggable(elements){
           	elements.draggable({
           		containment:'parent',
           		start:function(e,ui){ ui.helper.css('z-index',++zIndex); },
           		stop:function(e,ui){}
           	});
          }// end of make_draggable
        

        function add_rule(){
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
            $('footer').html(rule);
            r.removeClass('newr');
            $('.container').append('<div class="rules newr" id="rule-'+ accumulator + '"></div><br>');
            make_droppable();
          }catch(e){
            alert(e);
          }
        }

        make_droppable();
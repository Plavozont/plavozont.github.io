    

    document.addEventListener("DOMContentLoaded", function(event)
    {
        window.pages = "001 - 002,003 - 004,005 - 006,007 - 009,010 - 011,012 - 014,015 - 016,017 - 018,019 - 021,022 - 024,025 - 026,027 - 029".split(",")
        window.page_song_names = "'ABC', 'B-a-Bay'|'Good morning', 'My name is...'|'I see a pen, I see a hen', 'I see a pen on the desk'|'This is Jack and that is Jill...', 'What's this? It's a school bag...', 'One sun, two shoes, three trees...'|'1 potatos, 2 potatos...', '1 little, 2 little 3 little indians...'|'One, one, one, Little dog run...', 'Why do you cry Willy?', 'Blue sea, green three, brow hand...'|'I see pink, he sees brown...', 'spring is green, summer is white...'|'The frog is green, green, green...', 'Here is a big doll, here is a big ball...'|'Clean the blackboard, clean the door...', 'Put your right hand in, Take your right hand out...'|'This is my father, this is my mother...', 'How is your mother, she is fine, thanks...', 'Good night, father, good night, mother...'|'I have a father, I have a mother....', 'I have a hare, I have a bear...'|'Look at the boy - He has a toy...', 'Sam has a hat...', 'I have two eyes and I can see...'".split("|")
        
        for (i = 0; i < window.pages.length; i++)
        {
            var menu_item = "<a href='#" + window.pages[i] + "' onclick='loadpage(\"" + window.pages[i] + "\")'>" + (i + 1) + ". " + window.pages[i] + " " + window.page_song_names[i] + "</a>";
            
            document.getElementById("myDropdown").insertAdjacentHTML("beforeend", menu_item)
        }
        
        // Close the dropdown menu if the user clicks outside of it
        window.onclick = function(event)
        {
            if (!event.target.matches('.dropbtn'))
            {
                var dropdowns = document.getElementsByClassName("dropdown-content");
                var i;
                for (i = 0; i < dropdowns.length; i++)
                {
                  var openDropdown = dropdowns[i];
                  if (openDropdown.classList.contains('show'))
                  {
                    openDropdown.classList.remove('show');
                  }
                }
            }
        }
        
        var reshetka = window.location.href.indexOf("#")
        
        if (reshetka != -1)
        {
            //var anch = window.location.href.substring(window.location.href.indexOf("#")+1)
            
            loadpage(decodeURIComponent(window.location.hash.replace("#","")))
            
        } else
        {
            loadpage("001 - 002")
        }
        
        document.body.addEventListener("mousemove", function (event) {move_circle(event)}, false)
        document.body.addEventListener("mousedown", function (event) {grab_circle(event)}, false)
        document.body.addEventListener("mouseup", function (event) {release_circle(event)}, false)
        
        
        
        //~ window.cnvs = document.getElementById("myCanvas");
        
    })

    document.addEventListener("keypress", function(event)
    {
        if (event.code=="KeyC")
        {
            new_circle()
        }
    })
    
    function img_onload()
    {
        window.onresize()
    }

function grab_circle(event)
{
    
    var els = elsatpoint(event, "circle");
    if (els.length == 0) return
    
    window.grabbed_circle = els[0].id
    
}

function move_circle(event)
{
    
    if (window.grabbed_circle == undefined) return
    
    var circ = document.getElementById(window.grabbed_circle)
    
    var x = event.pageX
    var y = event.pageY
    


    //circ.style.left = (px + (event.layerX)) + "px"
    //circ.style.top = (py + (py - y)) + "px"
    
    if (event.buttons == 1)
    {
        circ.style.left = (parseInt(circ.style.left.replace("px","")) + event.movementX) + "px"
        circ.style.top = (parseInt(circ.style.top.replace("px","")) + event.movementY) + "px"
    }

    if (event.buttons == 4)
    {
            circ.style.width = (parseInt(circ.style.width.replace("px","")) + (event.movementX>event.movementY ? event.movementX : event.movementY)) + "px"
            circ.style.height = (parseInt(circ.style.height.replace("px","")) + (event.movementX>event.movementY ? event.movementX : event.movementY)) + "px"
            
            var img_width = window.img.clientWidth

            window.circle_places[circ.id.replace("circle","")].r = (parseInt(circ.style.width.replace("px","")) / img_width) * 100
    }

    //var r = window.circle_places[circ.id].r

    
    //var img_height = window.img.clientHeight
    //var img_width = window.img.clientWidth
    
    
    //var square_size = ((img_height >= img_width) ? img_width : img_height) * (r/100);
    
    //console.log(      ((x - window.img.offsetLeft + 2) * 100 / (img_width) ) + "," + ((y - window.img.offsetTop + 2) * 100 / (img_height)  ) + ",10"           )
    
}


function show_circ_params(event, el)
{
    var x = el.offsetLeft
    var y = el.offsetTop

    var img_height = window.img.clientHeight
    var img_width = window.img.clientWidth

    var r = window.circle_places[el.id.replace("circle","")].r

    var square_size = ((img_height >= img_width) ? img_width : img_height) * (r/100);

    var circ_x = ((x - window.img.offsetLeft + 2 + (square_size/2) ) * 100 / (img_width))
    var circ_y = ((y - window.img.offsetTop + 2 + (square_size/2)) * 100 / (img_height) )

    alert("|" + (circ_x) + "," + (circ_y) + "," + r)
}








function release_circle(event)
{
    delete window.grabbed_circle
}


window.onresize = function ()
{
    for (let i = 0; i < circle_places.length; i++) {
        place_circle(i)
    }
    
    place_triangle("triangle_left")
    place_triangle("triangle_right")
    
    //~ window.cnvs.style.width = img.clientWidth + "px";
    //~ window.cnvs.style.height = img.clientHeight + "px";
}

function create_circle(id, song, x, y, r)
{
    document.body.insertAdjacentHTML('afterbegin', '<div id="circle' + id + '" class="circle" touchend="play_song(\'' + song.replace(/'/g,"\\'") + '\')" onclick="play_song(\'' + song.replace(/'/g,"\\'") + '\')" ondblclick="show_circ_params(event, this)"></div>')
    if (window.circle_places == undefined) window.circle_places = []
    if (window.circle_places[id] == undefined) window.circle_places[id] = {}
    
    window.circle_places[id].x = x
    window.circle_places[id].y = y
    window.circle_places[id].r = r
}



function create_triangle(id, x, y, r)
{
    if (id.indexOf("left") != -1)
    {
        var style = "style='transform:rotate(270deg);'";
    }

    if (id.indexOf("right") != -1)
    {
        var style = "style='transform:rotate(90deg);'";
    }

    document.body.insertAdjacentHTML('afterbegin', '<div id="' + id + '" class="triangle" ' + style + ' touchend=\'switch_page("' + id + '")\' onclick=\'switch_page("' + id + '")\'><div id = "' + id + '_inner" class="triangle_inner"></div></div>')
    
    
    if (window.triangle_places == undefined) window.triangle_places = []
    if (window.triangle_places[id] == undefined) window.triangle_places[id] = {}
    
    window.triangle_places[id].x = x
    window.triangle_places[id].y = y
    window.triangle_places[id].r = r

}



function destroy_circles()
{
    //return
    var circles = document.getElementsByClassName("circle")
    
    while(circles.length!=0)
    {
        
        circles = document.getElementsByClassName("circle")
        //console.log(circles[0])
        circles[0].parentNode.removeChild(circles[0])
    }
    
    //for (var i=0;i<circles.length; i++)
    //{
        //console.log(circles[i])
        
    //}
}

function play_song(song)
{
    //window.location = song
    //return
    var player = document.getElementById("song_box")
    player.src = song
    player.play(); 
}

function place_circle(id)
{
    var c1 = document.getElementById("circle"+id)
    
    if (c1 == undefined) return
    
    var x = window.circle_places[id].x
    var y = window.circle_places[id].y
    var r = window.circle_places[id].r
    
    var img_height = window.img.clientHeight
    var img_width = window.img.clientWidth
    
    var square_size = ((img_height >= img_width) ? img_width : img_height) * (r/100);
    
    //console.log(img_height + " " + img_width)
    
    
    c1.style.top = (((img_height * (y / 100)) + window.img.offsetTop) - (square_size / 2)) - 2 + "px"
    c1.style.left = (((img_width * (x / 100)) + window.img.offsetLeft) - (square_size / 2)) - 2 + "px"
    
    c1.style.height = (square_size) + "px"
    c1.style.width = (square_size) + "px"
}



function place_triangle(id)
{
    var t1 = document.getElementById(id)
    var t1i = document.getElementById(id + "_inner")
    
    if (t1 == undefined) return
    
    var x = window.triangle_places[id].x
    var y = window.triangle_places[id].y
    var r = window.triangle_places[id].r
    
    var img_height = window.img.clientHeight
    var img_width = window.img.clientWidth
    
    var square_size = ((img_height >= img_width) ? img_width : img_height) * (r/100);
    
    //console.log(img_height + " " + img_width)
    
    var half_size = Math.round(square_size/2)
    
    //чёрный треугольник (в роли чёрной границы)
    t1.style.top = Math.round((((img_height * (y / 100)) + window.img.offsetTop) - (square_size / 2)) - 2) + "px"
    t1.style.left = Math.round((((img_width * (x / 100)) + window.img.offsetLeft) - (square_size / 2)) - 2) + "px"

    t1.style.borderBottomWidth = (square_size) + "px"
    t1.style.borderLeftWidth = half_size + "px"
    t1.style.borderRightWidth = half_size + "px"

    
    //Белый треугольник внутри чёрного
    t1i.style.top = Math.round(half_size * (3/50)) + "px"
    t1i.style.left = -Math.round((half_size * (47/50))) + "px"
    
    t1i.style.borderBottomWidth = Math.round(square_size * (95/100)) + "px"
    t1i.style.borderLeftWidth = Math.round(half_size * (47/50)) + "px"
    t1i.style.borderRightWidth = Math.round(half_size * (47/50)) + "px"



    //c1.style.width = (square_size) + "px"
}



/* When the user clicks on the button,
toggle between hiding and showing the dropdown content */
function myFunction(evt) {
    
    var menu = document.getElementsByClassName("dropdown")[0]
    
    var buttonTop = evt.target.offsetTop + evt.target.clientHeight
    var buttonLeft = evt.target.offsetLeft
    
    //console.log(menuTop + " x " + menuLeft)
    
    menu.style.left = buttonLeft + "px"
    menu.style.top = buttonTop + "px"
    
    document.getElementById("myDropdown").classList.toggle("show");
    
}

function switch_page(id)
{
    if (id.indexOf("left") != -1)
    {
        var ind = pages.indexOf(decodeURIComponent(window.location.hash.replace('#','')))
        if (ind - 1 >= 0)
        {
            var new_ind = ind - 1
            window.location = "#" + window.pages[new_ind]
            window.location.reload()
        }
    }

    if (id.indexOf("right") != -1)
    {
        var ind = pages.indexOf(decodeURIComponent(window.location.hash.replace('#','')))
        if (ind + 1 < pages.length)
        {
            var new_ind = ind + 1
            window.location = "#" + window.pages[new_ind]
            window.location.reload()
        }
    }

}

function loadpage(page_name)
{
    console.log(page_name)
    
    destroy_circles()
    
    window.img = document.getElementById("songs_img");
    
    var pages_params = `
    001 - 002/010.JPG
    001 - 002/001 - ABC(song).mp3|78.11340752517224,31.687546057479736,10
    001 - 002/002 - B-A-Bay(song).mp3|83,59,20
    ;
    003 - 004/011.JPG
    003 - 004/003 - Good morning(song).mp3|40.75251722310546,81.87177597641858,10
    003 - 004/004 - My name is Ann(song).mp3|83.26153846153846,44.22583404619333,10
    ;
    005 - 006/012.JPG
    005 - 006/005 - I see a pen. I see a hen(song).mp3|33.65129835718071,67.50184229918939,10
    005 - 006/006 - I see a pen on the desk(song).mp3|81.50503444621091,33.01400147383935,10
    ;
    007 - 009/013.JPG
    007 - 009/007 - This is Jack and That is Jill(song).mp3|8.95601483836778,46.79439941046426,10
    007 - 009/008 - What's this it's a school bag(song).mp3|9.220985691573928,58.36403831982314,10
    007 - 009/009 - One sun, two shoes, three trees(song).mp3|74.56279809220986,42.446573323507735,10
    ;
    010 - 011/014.JPG
    010 - 011/010 - One potato(song).mp3|40.59353471118177,84.45099484156226,15
    010 - 011/011 - One little, two little, three little indian(song).mp3|89.0302066772655,73.9867354458364,10
    ;
    012 - 014/015.JPG
    012 - 014/012 - One one one little dog run(song).mp3|23.90037095919449,25.202652910832718,10
    012 - 014/013 - Why do you cry Willy(song).mp3|41.229464758876524,86.36698599852616,10
    012 - 014/014 - Blue sea green tree(song).mp3|90.46104928457869,75.9027266028003,10
    ;
    015 - 016/016.JPG
    015 - 016/015 - I see pink, he sees brown(song).mp3|7.260201377848436,88.13559322033899,10
    015 - 016/016 - Spring, summer, autumn, winter(song).mp3|89.82511923688395,14.296241709653648,10
    ;
    017 - 018/017.JPG
    017 - 018/017 - The frog is green green green(song).mp3|9.432962374138844,13.633014001473839,15
    017 - 018/018 - Here is big ball, here is a big doll(song).mp3|88.92421833598304,59.83787767133382,15
    ;
    019 - 021/018.JPG
    019 - 021/019 - Clean the blackboard, clean the door(song).mp3|10.91679915209327,14.959469417833455,15
    019 - 021/020 - One, two, tie your shoe(song).mp3|43.08426073131955,53.86882829771555,10
    019 - 021/021 - Put your right hand in, take your right hand out(song).mp3|69.52835188129306,12.159174649963154,10
    ;
    022 - 024/019.JPG
    022 - 024/022 - This is my mother, this is my father, this is my brother paul(song).mp3|44.091149973502915,15.991156963890935,10
    022 - 024/023 - How is your mother, she is fine, thanks(song).mp3|38.52676205617382,62.85924834193073,10
    022 - 024/024 - Goodnight, Father! Goodnight Mother!(song).mp3|57.65765765765766,49.963154016212236,10
    ;
    025 - 026/020.JPG
    025 - 026/025 - I have a father, I have a mother, I have a sister(song).mp3|11.128775834658187,58.142962417096534,10
    025 - 026/026 - I have a hear, I have a bear, my toys are here, my toys are there(song).mp3|58.66454689984102,17.75976418570376,10
    ;
    027 - 029/021.JPG
    027 - 029/027 - Look at the boy, he has a toy(song).mp3|25.278219395866454,16.212232866617537,15
    027 - 029/028 - Sam has a hat(song).mp3|75.30471648118707,28.445099484156227,10
    027 - 029/029 - I have two eyes and I can see(song).mp3|89.45416004239533,82.38761974944731,10
    ;
    030 - 031/022.JPG
    030 - 031/030 - Alouette(song).mp3|44.7148288973384,35.06042296072508,10
    030 - 031/031 - I have two legs with which I walk(song).mp3|92.29766431287344,73.80664652567975,10
    ;   
    032 - 036/023.JPG
    032 - 036/032 - I've got 10 little fingers(song).mp3|28.473655621944598,12.401812688821753,10
    032 - 036/033 - We have fingers, we have toes(song).mp3|28.732210755024443,64.42296072507553,8
    032 - 036/034 - I have little dog(song).mp3|80.75611080934274,16.444108761329304,6
    032 - 036/035 - I have a little pussy(song).mp3|90.16621401412276,32.02114803625378,8
    032 - 036/036 - My cat is black(song).mp3|59.59804454101032,60.58912386706949,10
    ;
    037 - 041/024.JPG
    037 - 041/037 - Peter has a pencil(song).mp3|32.718087995654535,11.581570996978853,7
    037 - 041/038 - Little bird, little bird(song).mp3|26.268245108623336,49.48949942973984,9
    037 - 041/039 - I have a cat, his name is Pit(song).mp3|10.820206409560022,74.63746223564955,8
    037 - 041/040 - I like to read, I like to play(song).mp3|78.44649646931016,15.120845921450151,10
    037 - 041/041 - We like to swim, we like to play(song).mp3|59.04942965779467,54.992447129909365,5
    ;
    042 - 047/025.JPG
    042 - 047/042 - Finger, 1 thumb - keep moving(song).mp3|44.87778381314503,34.98489425981873,10
    042 - 047/043 - Together, together, together every day(song).mp3|45.09505703422053,60.06042296072508,9
    042 - 047/044 - I say, take a cock(song).mp3|9.136338946224878,63.610271903323266,10
    042 - 047/045 - One two three, I like dogs(song).mp3|27.449212384573602,78.04682779456192,7
    042 - 047/046 - One, two, three, let me see(song).mp3|71.38511678435633,13.685800604229607,10
    042 - 047/047 - I like this cat, Nina likes that(song).mp3|58.72895165670831,80.37764350453172,10
    ;
    048 - 051/026.JPG
    048 - 051/048 - Tick-tock, tick-tock(song).mp3|10.277023356871265,13.157099697885196,10
    048 - 051/049 - I scream, you scream(song).mp3|13.264530146659425,72.6737160120846,10
    048 - 051/050 - Put the pencil on the table(song).mp3|82.24877783813145,13.987915407854985,9.5
    048 - 051/051 - Tinker, Tailor, Solder, Sailor(song).mp3|88.27810972297664,74.25981873111782,10
    ;
    052 - 054/027.JPG
    052 - 054/052 - If you are happy and you know it(song).mp3|18.26181423139598,49.86404833836858,10
    052 - 054/053 - I am Yura, You are Shura(song).mp3|90.17925040738729,17.83987915407855,10
    052 - 054/054 - We are six, we are big(song).mp3|70.24443237370994,76.97885196374622,10
    ;
    055 - 060/028.JPG
    055 - 060/055 - I'm at the window(song).mp3|29.234111895708857,11.722054380664652,10
    055 - 060/056 - I am a boy, I'm a boy(song).mp3|39.01140684410647,25.01510574018127,10
    055 - 060/057 - I am a pupil, he is a pupil(song).mp3|31.08093427485063,60.06042296072508,10
    055 - 060/058 - How do you do, Harry(song).mp3|93.43834872351982,19.72809667673716,10
    055 - 060/059 - How do you do, Harry(song).mp3|93.54698533405758,46.9939577039275,10
    055 - 060/060 - How do you do, Nick(song).mp3|59.163498098859314,71.69184290030212,10
    ;
    061 - 063/029.JPG
    061 - 063/061 - What is your name(name).mp3|11.037479630635524,13.761329305135952,10
    061 - 063/062 - Your friend is his friend(song).mp3|85.34492123845736,25.54380664652568,10
    061 - 063/063 - Bill's dog is big(song).mp3|71.05920695274307,52.2809667673716,10
    `.split(";")
    
    
    var pages = window.pages;
    
    window.pages = []

    for (var i=0;i<pages_params.length;i++)
    {
        var clean_text = pages_params[i].replace("\n","").trim()
        var pn = clean_text.substring(0,clean_text.indexOf("/"))

        window.pages.push(pn)

        if (pages_params[i].indexOf(page_name) != -1)
        {
            var page_index = i
            //break;
        }
    }
    
    //var page_index = pages.indexOf(page_name)
    

    
    var page_param = pages_params[page_index].split("\n")
    //console.log(page_param)
    
    
    
    
    var j = 0
    
    for (var i=0;i<page_param.length;i++)
    {
        if (page_param[i].trim() == "") continue
        
        if (j==0) 
        {
            var img_file = page_param[i]
            window.img.src = img_file
            

        }
        
        if (j>=1)
        {
            var circle_name = j-1
            
            //console.log(circle_name)
            
            var circle_params = page_param[i].split("|")
            
            var circle_song = circle_params[0]
            
            if (typeof(circle_params[1]) != "undefined")
            {
                var circle_params = circle_params[1].split(",")
            
            
                //console.log(circle_params)
                
                var circle_x = circle_params[0]
                var circle_y = circle_params[1]
                var circle_r = circle_params[2]
                //console.log(circle_name + "," + circle_song + "," + circle_x + "," + circle_y + "," + circle_r)
                create_circle(circle_name,circle_song,circle_x,circle_y,circle_r)
            }

            
            
            
            
            
        }
        
        

        j++
    }
    
    
    create_triangle("triangle_left", 3.562737642585551,38.30513595166163, 6)
    create_triangle("triangle_right", 95.93697478991596,38.30513595166163, 6)
    
    //destroy_circles()
    
    
    //~ if (page_name == '001-002')
    //~ {
        //~ window.img.src = "001 - 002/010.JPG"
        //~ create_circle("circle1", "001 - 002/001 - ABC(song).mp3",78.11340752517224,31.687546057479736,10)
        //~ create_circle("circle2", "001 - 002/002 - B-A-Bay(song).mp3",83,59,20)
    //~ } else if (page_name == '003-004')
    //~ {
        //~ window.img.src = "003 - 004/011.JPG"
        //~ create_circle("circle1", "003 - 004/003 - Good morning(song).mp3",40.75251722310546,81.87177597641858,10)
        //~ create_circle("circle2", "003 - 004/004 - My name is Ann(song).mp3",83.26153846153846,44.22583404619333,10)
    //~ } else if (page_name == '005-006')
    //~ {
        //~ window.img.src = "005 - 006/012.JPG"
        //~ create_circle("circle1", "005 - 006/005 - I see a pen. I see a hen(song).mp3",33.65129835718071,67.50184229918939,10)
        //~ create_circle("circle2", "005 - 006/006 - I see a pen on the desk(song).mp3",81.50503444621091,33.01400147383935,10)
    //~ } else
    //~ {
        //~ alert("Неверное имя страницы")
    //~ }
    
    
    // place_circle("circle1")
    // place_circle("circle2")
    // place_circle("circle3")
    
    // place_triangle("triangle_left")
    //place_triangle("triangle_right")

    
}

function new_circle()
{
    if (typeof(window.circle_places) == "undefined")
    {
        var new_circ_index = 0    
    } else
    {
        var new_circ_index = window.circle_places.length;
    }
    
    create_circle(new_circ_index,'',45,45,10)
    place_circle(new_circ_index)

}

//Elements At Point. Находит html-элементы в документе по координатам x и y.
function elsatpoint(e, cls)
{
    var clickX = e.pageX
        ,clickY = e.pageY
        ,list
        ,$list
        ,offset
        ,range
    
    var boxes = document.querySelectorAll("." + cls)
    
    $list1 = []
    
    for (box_i = 0; box_i < boxes.length; box_i++)
    {
        var box = boxes[box_i]
        offs = window.offset(box);
        
        range = {
            x: [ offs.left,
                offs.left + box.offsetWidth ],
            y: [ offs.top,
                offs.top + box.offsetHeight ]
        };
        
        if ((clickX >= range.x[0] && clickX <= range.x[1]) && (clickY >= range.y[0] && clickY <= range.y[1]))
        {
            $list1.push(box)
        }
    }
    
    return $list1;
}


function offset(el)
{
    var rect = el.getBoundingClientRect(),
    scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
    scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    return { top: rect.top + scrollTop, left: rect.left + scrollLeft }
}


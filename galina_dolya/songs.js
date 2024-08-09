    
    document.addEventListener("DOMContentLoaded", function(event)
    {
        window.pages = "001-002,003-004,005-006,007-009,010-011,012-014,015-016,017-018,019-021,022-024,025-026,027-029".split(",")
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
            var anch = window.location.href.substring(window.location.href.indexOf("#")+1)
            
            loadpage(anch)
            
        } else
        {
            loadpage("001-002")
        }
        
        document.body.addEventListener("mousemove", function (event) {move_circle(event)}, false)
        document.body.addEventListener("mousedown", function (event) {grab_circle(event)}, false)
        document.body.addEventListener("mouseup", function (event) {release_circle(event)}, false)
        
        
        
        //~ window.cnvs = document.getElementById("myCanvas");
        
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
    
    
    
    circ.style.left = (x - (circ.clientWidth / 2)) + "px"
    circ.style.top = (y - (circ.clientHeight / 2)) + "px"
    
    
    var r = window.circle_places[circ.id].r

    
    var img_height = window.img.clientHeight
    var img_width = window.img.clientWidth
    
    
    var square_size = ((img_height >= img_width) ? img_width : img_height) * (r/100);
    
    console.log(      ((x - window.img.offsetLeft + 2) * 100 / (img_width) ) + "," + ((y - window.img.offsetTop + 2) * 100 / (img_height)  ) + ",10"           )
    
}











function release_circle(event)
{
    delete window.grabbed_circle
}


window.onresize = function ()
{
    
    place_circle("circle1")
    place_circle("circle2")
    place_circle("circle3")
    
    //~ window.cnvs.style.width = img.clientWidth + "px";
    //~ window.cnvs.style.height = img.clientHeight + "px";
}

function create_circle(id, song, x, y, r)
{
    document.body.insertAdjacentHTML('afterbegin', '<div id="' + id + '" class="circle" touchend="play_song(\'' + song.replace(/'/g,"\\'") + '\')" onclick="play_song(\'' + song.replace(/'/g,"\\'") + '\')"></div>')
    if (window.circle_places == undefined) window.circle_places = []
    if (window.circle_places[id] == undefined) window.circle_places[id] = {}
    
    window.circle_places[id].x = x
    window.circle_places[id].y = y
    window.circle_places[id].r = r
    
    
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
    var c1 = document.getElementById(id)
    
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


function loadpage(page_name)
{
    console.log(page_name)
    
    destroy_circles()
    
    window.img = document.getElementById("songs_img");
    
    var pages_params = `001 - 002/010.JPG
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
    `.split(";")
    
    
    var pages = window.pages;
    
    
    var page_index = pages.indexOf(page_name)
    
    
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
            var circle_name = "circle" + (j)
            
            //console.log(circle_name)
            
            var circle_params = page_param[i].split("|")
            
            var circle_song = circle_params[0]
            
            var circle_params = circle_params[1].split(",")
            
            
            //console.log(circle_params)
            
            var circle_x = circle_params[0]
            var circle_y = circle_params[1]
            var circle_r = circle_params[2]
            //console.log(circle_name + "," + circle_song + "," + circle_x + "," + circle_y + "," + circle_r)
            create_circle(circle_name,circle_song,circle_x,circle_y,circle_r)
            
            
            
            
            
        }
        
        
        j++
    }
    
    
    
    
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
    
    
    place_circle("circle1")
    place_circle("circle2")
    place_circle("circle3")
    
    
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



        var randcolor = {r: 0, g:0, b:0}

        //https://gist.github.com/emiel/416af1b5027ef52849cf8f72fb9e414d
        decode_argb = function(argb_val)
        {
            /*
            - https://en.wikipedia.org/wiki/RGBA_color_space
            - ARGB (word-order)
            - https://developer.mozilla.org/en-US/docs/Web/CSS/color_value
            */

            return {
                a: (argb_val & 0xff000000) >>> 24,
                r: (argb_val & 0x00ff0000) >>> 16,
                g: (argb_val & 0x0000ff00) >>> 8,
                b: (argb_val & 0x000000ff)
            }
        }

        encode_argb = function(a, r, g, b)
        {
            return (a << 24) + (r << 16) + (g << 8) + b;
        }

        function GetObject()
        {
            window._objects
            var nextObjs = []
            window._objects.forEach(element => {
                if (element.Width <= window.maxSize) { nextObjs.push(element) }
            });

            var rnd_ind = Math.round(Math.random()*(nextObjs.length-1))
            
            // if (typeof(nextObjs[rnd_ind]) == "undefined")
            // {
            //     debugger
            // }

            return nextObjs[rnd_ind];
        }

        function Generate(sizeHeight, sizeWidth, pad)
        {
            //Последовательно сканируется массив
            for (var y = 1 + pad; y < sizeHeight; y++)
            for (var x = 1 + pad; x < sizeWidth; x++)
            {
                // no maxSize bail
                
                var gms = GetMaxSize(x, y, sizeHeight, sizeWidth, pad)//Проверяем какой максимально большой квадратик можно в текущую позицию впихнуть
                //var maxSize = window.maxSize
                if (!gms) continue;//если пиксель занят уже чем-то сканируем дальше

                // pick a random one
                var nextObj = GetObject(window.maxSize);//Выбираем квадратик случайного размера, но меньше или равно максимально впихиваемому квадратику
                if (nextObj == undefined) continue;
                // draw the thing
                var parimetr_priamougolnika = ((nextObj.Width-1) * 4) - 1 - 4
                if (nextObj.Width <=2 ) parimetr_priamougolnika=0
                var random_enterance = Math.round(Math.random()*parimetr_priamougolnika)
                if (nextObj.Width >2 )console.log("random_enterance: " + nextObj.Width + ", " + random_enterance)
                var perim_counter = -1
                var rnd_color = encode_argb(255, Math.round(Math.random()*255), Math.round(Math.random()*255), Math.round(Math.random()*255))
                for (var y2 = y; y2 < y + nextObj.Width; y2++)
                {
                    for (var x2 = x; x2 < x + nextObj.Width; x2++)
                    {
                        if (y2 == y || y2 == y + nextObj.Width - 1 || x2 == x || x2 == x + nextObj.Width - 1)
                        {
                            //Это углы
                            if ( (y2 == y && x2 == x) || (y2 == y && x2 == x + nextObj.Width - 1) || (x2 == x && y2 == y + nextObj.Width - 1) || (y2 == y + nextObj.Width - 1 && x2 == x + nextObj.Width - 1) )
                            {
                                window.data_arr[x2][y2] = rnd_color
                                //encode_argb(255,0,0,0)
                            } else//Это стены
                            {
                                window.data_arr[x2][y2] = rnd_color
                                //encode_argb(255,0,0,0)
                                perim_counter++
                                if (perim_counter == random_enterance) window.data_arr[x2][y2] = encode_argb(255,254,254,254)
                            }
                            
                            // if (perim_counter == random_enterance)
                            // {
                            //     window.data_arr[x2][y2] = encode_argb(255,0,255,0)
                            // } else
                            // {
                            //     //window.data_arr[x2][y2] = encode_argb(255,0,0,0)
                            // }
                            
                        } else
                        {
                            window.data_arr[x2][y2] = encode_argb(255,254,254,254)
                        }
                        
                        //*(array + x2 + y2 * size_Width) = nextObj.Color;//https://devtut.github.io/csharp/pointers.html
                    }
                }
                // start again outside that width
                // remembering the loop will increment this anyway
                x += nextObj.Width + pad - 1;
            }
        }

        function GetMaxSize(x, y, sizeHeight, sizeWidth, pad)
        {
            sizeHeight1=sizeHeight-1
            window.maxSize = 0;

            //we cant be within pad distance of anything else or the edges
            for (var y2 = y - pad; y2 < y + pad; y2++)
                for (var x2 = x - pad; x2 < x + pad; x2++)
                    if (y2 < 0 || x2 < 0 || y2 >= sizeHeight1 || x2 >= sizeWidth || window.data_arr[x2][y2] != 0)
                        return false;

            // so what do we have left
            for (var y2 = y - pad; y2 < y + 1; y2++)
            {
                var max = window.maxSize > 0 ? window.maxSize : _largest + pad;
                window.maxSize = 0;
                for (var x2 = x; x2 < sizeWidth && x2 < x + max; x2++, window.maxSize++)
                    if (window.data_arr[x2][y2] != 0)
                        break;
            }

            // safety first
            window.maxSize = Math.min(window.maxSize - pad, Math.min(sizeWidth - x - pad, sizeHeight1 - y - pad));

            return window.maxSize > 0;
        }

        function RoomGen()
        {
            window.size_x = 20
            window.size_y = 20
            var maxwidth = 6
            var minwidth = 1
            var pad = 1


            window._objects = []
            var max_width=0
            for (let i = minwidth; i <= maxwidth; i++) {
                if (i==3 || i==3) continue
                if (max_width<i) max_width = i
                window._objects.push({Width: i, Color: encode_argb(255, Math.round(Math.random()*255), Math.round(Math.random()*255), Math.round(Math.random()*255))})
            }
            
            window._largest = maxwidth - minwidth
            //size = 100
            //debugger
            window.data_arr=[]
            for (var x = 0; x < window.size_x; x++)
            for (var y = 0; y < window.size_y; y++)
            {
                if (typeof(window.data_arr[y]) == "undefined")
                {
                    window.data_arr[y] = []
                }
                if (x==0)
                {
                    window.data_arr[y][x] = -16777216
                } else if (x==window.size_x-1)
                {
                    window.data_arr[y][x] = -16777216
                } else if (y==0)
                {
                    window.data_arr[y][x] = -16777216
                } else if (y==window.size_y-1)
                {
                    window.data_arr[y][x] = -16777216
                } else
                {
                    window.data_arr[y][x] = 0
                }
                
            }
            
            Generate(window.size_x, window.size_y, pad);
            console.log(window.data_arr)
            var map_string = ""//"1".repeat(window.size_x + 2)+"\n"
            for (var y = 0; y < window.size_y; y++)
            {
                //map_string += "1"
                for (var x = 0; x < window.size_x; x++)
                {
                    var argb = decode_argb(window.data_arr[y][x])
                    //window.context.fillStyle = "rgba("+argb.r+","+argb.g+","+argb.b+","+(argb.a/255)+")";
                    //window.context.fillRect( x*window.multiplier, y*window.multiplier, window.multiplier, window.multiplier );
                    if (window.data_arr[y][x]==-16777216)
                    {
                        map_string += "1"
                    } else
                    {
                        map_string += " "
                    }
                }
                map_string += "\n"
            }
            //map_string += "1".repeat(window.size_x + 2)+"\n"
            
            return window.data_arr
        }
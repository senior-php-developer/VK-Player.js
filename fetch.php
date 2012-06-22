<?php

$q = str_replace(' ','+',$_GET['q']);

echo file_get_contents('http://www.last.fm/music/'.$q.'/+charts?rangetype=6month&subtype=tracks');
//echo 'http://www.last.fm/music/'.$q.'/+charts?rangetype=6month&subtype=tracks';
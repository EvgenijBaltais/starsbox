<?


for ($u = 1; $u <= 75; $u++) {

   $basepath = 'brands/' . $u;

     $filelist = scandir($basepath);
     $t = 0;
     foreach($filelist as $i => $filename) {
          if($filename !== '.' && $filename !== '..') {
               rename ($basepath.'/'.$filename, $basepath.'/'. ++$t .'_s.jpg');
          }
     }
}

?>
<?php


function update_players_ls( $ls ) {

    $data_to_write = $ls;
    $file_path = "./assets/js/data/top-player.json";
    $file_handle = fopen($file_path, 'w'); 
    fwrite($file_handle, $data_to_write);
    fclose($file_handle);

}

if ( $_SERVER['REQUEST_METHOD'] === 'POST' ) {

    $list = file_get_contents('php://input');
    update_players_ls( $list );
    
}

?>
<?php
if(!defined('DOKU_INC')) die();

class syntax_plugin_bingogame extends DokuWiki_Syntax_Plugin {

    public function getType() {
        return 'substition';
    }

    public function getPType() {
        return 'block';
    }

    public function getSort() {
        return 32;
    }

    public function connectTo($mode) {
        $this->Lexer->addSpecialPattern('\{\{bingogame:.+?\}\}', $mode, 'plugin_bingogame');
    }

    public function handle($match, $state, $pos, Doku_Handler $handler) {
        $match = substr($match, 12, -2); // Remove {{bingogame: and }}
        $words = array_map('trim', explode(',', $match));
        return array('words' => $words);
    }

    public function render($mode, Doku_Renderer $renderer, $data) {
        if ($mode !== 'xhtml') {
            return false;
        }

        $words = isset($data['words']) ? $data['words'] : [];
        $jsWords = json_encode($words);

        $renderer->doc .= '<div id="bingo-container">';
        $renderer->doc .= '<audio id="bingo-sound" src="'.DOKU_BASE.'lib/plugins/bingogame/bingo-sound.mp3"></audio>';
        $renderer->doc .= '<div class="container">';
        $renderer->doc .= '<h1>Wort-Bingo-Spiel</h1>';
        $renderer->doc .= '<div id="bingo-card" class="bingo-card"></div>';
        $renderer->doc .= '</div>';
        $renderer->doc .= '<div id="popup" class="popup">';
        $renderer->doc .= '<div class="popup-content">';
        $renderer->doc .= '<h2 id="popup-message">Reihe abgeschlossen!</h2>';
        $renderer->doc .= '<button id="close-popup">Weiter</button>';
        $renderer->doc .= '</div>';
        $renderer->doc .= '</div>';
        $renderer->doc .= '</div>';

        $renderer->doc .= "<script>var bingoWords = $jsWords;</script>";

        return true;
    }
}

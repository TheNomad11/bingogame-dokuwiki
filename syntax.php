<?php
if(!defined('DOKU_INC')) die();

class syntax_plugin_bingogame extends DokuWiki_Syntax_Plugin {
    private static $instance_count = 0;

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
        $words = array_filter(array_map(function($word) {
            return substr(trim($word), 0, 30); // Trim and limit to 30 characters
        }, explode(',', $match)), function($word) {
            return preg_match('/^[a-zA-Z0-9\s]+$/', $word); // Only allow alphanumeric and spaces
        });
        $words = array_slice($words, 0, 16); // Limit to 16 words
        return array('words' => $words);
    }

    public function render($mode, Doku_Renderer $renderer, $data) {
        if ($mode !== 'xhtml') {
            return false;
        }

        self::$instance_count++;

        $words = isset($data['words']) ? $data['words'] : [];
        
        if (count($words) < 16) {
            msg('Bingogame: Nicht genügend gültige Wörter angegeben. Mindestens 16 Wörter erforderlich.', -1);
            return false;
        }

        $jsWords = json_encode($words, JSON_HEX_TAG | JSON_HEX_AMP | JSON_HEX_APOS | JSON_HEX_QUOT);
        $uniqueId = 'bingo-container-' . self::$instance_count;

        $renderer->doc .= '<div id="' . hsc($uniqueId) . '" class="bingo-container">';
        $renderer->doc .= '<audio class="bingo-sound" src="'.DOKU_BASE.'lib/plugins/bingogame/bingo-sound.mp3"></audio>';
        $renderer->doc .= '<div class="bingo-inner-container">';
        $renderer->doc .= '<h1>Wort-Bingo-Spiel</h1>';
        $renderer->doc .= '<div class="bingo-card"></div>';
        $renderer->doc .= '</div>';
        $renderer->doc .= '<div class="bingo-popup">';
        $renderer->doc .= '<div class="bingo-popup-content">';
        $renderer->doc .= '<h2 class="bingo-popup-message">Reihe abgeschlossen!</h2>';
        $renderer->doc .= '<button class="bingo-close-popup">Weiter</button>';
        $renderer->doc .= '</div>';
        $renderer->doc .= '</div>';
        $renderer->doc .= '</div>';

        $renderer->doc .= "<script>
            if (typeof bingoGames === 'undefined') {
                var bingoGames = [];
            }
            bingoGames.push({
                id: " . json_encode($uniqueId) . ",
                words: $jsWords
            });
        </script>";

        if (self::$instance_count === 1) {
            $renderer->doc .= "<script src='".DOKU_BASE."lib/plugins/bingogame/script.js'></script>";
        }

        return true;
    }
}

<?php
// must be run within DokuWiki
if(!defined('DOKU_INC')) die();

class syntax_plugin_bingo extends DokuWiki_Syntax_Plugin {

    // only include assets once
    protected static $assets_included = false;

    public function getType() { return 'substition'; }
    public function getPType() { return 'block'; }
    public function getSort() { return 100; }

    public function connectTo($mode) {
        // <bingo words="a,b,c,..." size="3" />
        $this->Lexer->addSpecialPattern('<bingo\b.*?\/>', $mode, 'plugin_bingo');
    }

    public function handle($match, $state, $pos, Doku_Handler $handler){
        // parse attributes
        $attr = array();
        if(preg_match_all('/([a-zA-Z_]+)\s*=\s*"([^"]*)"/', $match, $m, PREG_SET_ORDER)){
            foreach($m as $pair){
                $attr[strtolower($pair[1])] = $pair[2];
            }
        }

        // words attribute as comma separated
        $words_raw = isset($attr['words']) ? $attr['words'] : '';
        $words = array_map('trim', explode(',', $words_raw));
        $words = array_values(array_filter($words, function($w){ return $w !== ''; }));

        // size (default 3)
        $size = isset($attr['size']) ? intval($attr['size']) : 3;
        if($size !== 3 && $size !== 4) $size = 3;

        return array(
            'words' => $words,
            'size'  => $size
        );
    }

    public function render($mode, Doku_Renderer $renderer, $data) {
        if($mode !== 'xhtml') return false;

        $words = $data['words'];
        $size  = $data['size'];
        $expected = $size * $size;

        // include assets once
        if(!self::$assets_included){
            $pluginBase = DOKU_PLUGIN . 'bingo/';
            $renderer->doc .= '<link rel="stylesheet" href="' . $pluginBase . 'css/bingo.css" />' . "\n";
            $renderer->doc .= '<script src="' . $pluginBase . 'js/bingo.js"></script>' . "\n";
            self::$assets_included = true;
        }

        // unique container id
        static $id = 0;
        $id++;
        $containerId = "bingo_board_{$id}";
        $scoreId     = "bingo_score_{$id}";

        if(count($words) !== $expected){
            $renderer->doc .= '<div class="bingo-error">Bitte genau ' . $expected . ' Wörter angeben (size=' . $size . ').</div>';
            return true;
        }

        // sound file relative path
        $soundUrl = DOKU_PLUGIN . 'bingo/sounds/bingo.mp3';

        // render container with data-* attributes for JS
        $renderer->doc .= '<div class="bingo-container">' . "\n";
        $renderer->doc .= '<div id="'.htmlspecialchars($containerId).'" class="bingo-board"';
        $renderer->doc .= ' data-words="'.htmlspecialchars(json_encode($words)).'"';
        $renderer->doc .= ' data-size="'.htmlspecialchars($size).'"';
        $renderer->doc .= ' data-sound="'.htmlspecialchars($soundUrl).'"';
        $renderer->doc .= '></div>' . "\n";
        $renderer->doc .= '<div id="'.htmlspecialchars($scoreId).'" class="bingo-score">Punkte: 0</div>' . "\n";
        $renderer->doc .= '</div>' . "\n";

        return true;
    }
}

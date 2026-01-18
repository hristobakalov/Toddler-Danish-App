import '../../domain/entities/alphabet_item.dart';
import '../../domain/entities/word.dart';

class AlphabetLocalDataSource {
  List<AlphabetItem> getAlphabetItems() {
    return const [
      AlphabetItem(
        letter: 'A',
        words: [
          Word(text: 'Abe', emoji: '🐵'),
          Word(text: 'Avis', emoji: '📰'),
        ],
      ),
      AlphabetItem(
        letter: 'B',
        words: [
          Word(text: 'Bjørn', emoji: '🐻'),
          Word(text: 'Brød', emoji: '🍞'),
        ],
      ),
      AlphabetItem(
        letter: 'C',
        words: [
          Word(text: 'Cikade', emoji: '🦗'),
          Word(text: 'Cykel', emoji: '🚲'),
        ],
      ),
      AlphabetItem(
        letter: 'D',
        words: [
          Word(text: 'Delfin', emoji: '🐬'),
          Word(text: 'Dør', emoji: '🚪'),
        ],
      ),
      AlphabetItem(
        letter: 'E',
        words: [
          Word(text: 'Egern', emoji: '🐿️'),
          Word(text: 'Elev', emoji: '👨‍🎓'),
        ],
      ),
      AlphabetItem(
        letter: 'F',
        words: [
          Word(text: 'Fisk', emoji: '🐟'),
          Word(text: 'Fod', emoji: '🦶'),
        ],
      ),
      AlphabetItem(
        letter: 'G',
        words: [
          Word(text: 'Giraf', emoji: '🦒'),
          Word(text: 'Glas', emoji: '🥃'),
        ],
      ),
      AlphabetItem(
        letter: 'H',
        words: [
          Word(text: 'Hund', emoji: '🐕'),
          Word(text: 'Hus', emoji: '🏠'),
        ],
      ),
      AlphabetItem(
        letter: 'I',
        words: [
          Word(text: 'Ildflue', emoji: '🪲'),
          Word(text: 'Is', emoji: '🍦'),
        ],
      ),
      AlphabetItem(
        letter: 'J',
        words: [
          Word(text: 'Jaguar', emoji: '🐆'),
          Word(text: 'Jakke', emoji: '🧥'),
        ],
      ),
      AlphabetItem(
        letter: 'K',
        words: [
          Word(text: 'Kat', emoji: '🐈'),
          Word(text: 'Kaffe', emoji: '☕'),
        ],
      ),
      AlphabetItem(
        letter: 'L',
        words: [
          Word(text: 'Løve', emoji: '🦁'),
          Word(text: 'Lampe', emoji: '💡'),
        ],
      ),
      AlphabetItem(
        letter: 'M',
        words: [
          Word(text: 'Mus', emoji: '🐭'),
          Word(text: 'Mælk', emoji: '🥛'),
        ],
      ),
      AlphabetItem(
        letter: 'N',
        words: [
          Word(text: 'Næsehorn', emoji: '🦏'),
          Word(text: 'Nøgle', emoji: '🔑'),
        ],
      ),
      AlphabetItem(
        letter: 'O',
        words: [
          Word(text: 'Ørn', emoji: '🦅'),
          Word(text: 'Oste', emoji: '🧀'),
        ],
      ),
      AlphabetItem(
        letter: 'P',
        words: [
          Word(text: 'Pingvin', emoji: '🐧'),
          Word(text: 'Penge', emoji: '💰'),
        ],
      ),
      AlphabetItem(
        letter: 'Q',
        words: [
          Word(text: 'Quokka', emoji: '🦘'),
          Word(text: 'Quiz', emoji: '❓'),
        ],
      ),
      AlphabetItem(
        letter: 'R',
        words: [
          Word(text: 'Ræv', emoji: '🦊'),
          Word(text: 'Regn', emoji: '🌧️'),
        ],
      ),
      AlphabetItem(
        letter: 'S',
        words: [
          Word(text: 'Slange', emoji: '🐍'),
          Word(text: 'Sko', emoji: '👟'),
        ],
      ),
      AlphabetItem(
        letter: 'T',
        words: [
          Word(text: 'Tiger', emoji: '🐯'),
          Word(text: 'Tog', emoji: '🚂'),
        ],
      ),
      AlphabetItem(
        letter: 'U',
        words: [
          Word(text: 'Ugle', emoji: '🦉'),
          Word(text: 'Ur', emoji: '⏰'),
        ],
      ),
      AlphabetItem(
        letter: 'V',
        words: [
          Word(text: 'Vildsvin', emoji: '🐗'),
          Word(text: 'Vand', emoji: '💧'),
        ],
      ),
      AlphabetItem(
        letter: 'W',
        words: [
          Word(text: 'Wombat', emoji: '🦫'),
          Word(text: 'Weekend', emoji: '🏖️'),
        ],
      ),
      AlphabetItem(
        letter: 'X',
        words: [
          Word(text: 'Xerus', emoji: '🐿️'),
          Word(text: 'Xylofon', emoji: '🎵'),
        ],
      ),
      AlphabetItem(
        letter: 'Y',
        words: [
          Word(text: 'Yak', emoji: '🐃'),
          Word(text: 'Yoghurt', emoji: '🥣'),
        ],
      ),
      AlphabetItem(
        letter: 'Z',
        words: [
          Word(text: 'Zebra', emoji: '🦓'),
          Word(text: 'Zone', emoji: '🗺️'),
        ],
      ),
      AlphabetItem(
        letter: 'Æ',
        words: [
          Word(text: 'Æsel', emoji: '🫏'),
          Word(text: 'Æble', emoji: '🍎'),
        ],
      ),
      AlphabetItem(
        letter: 'Ø',
        words: [
          Word(text: 'Ørred', emoji: '🐟'),
          Word(text: 'Øl', emoji: '🍺'),
        ],
      ),
      AlphabetItem(
        letter: 'Å',
        words: [
          Word(text: 'Ål', emoji: '🐍'),
          Word(text: 'Åben', emoji: '🔓'),
        ],
      ),
    ];
  }
}

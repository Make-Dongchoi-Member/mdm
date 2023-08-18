import { Injectable } from '@nestjs/common';
import { GameReadyDTO } from './dto/GameReady.dto';
import { Bar } from 'src/types/interfaces';
import { BAR_BASIC_H, BAR_HARD_H, CANVAS_HEIGHT } from 'src/configs/constants';

@Injectable()
export class GameUtil {
  barSetter(info: GameReadyDTO): Bar {
    let bar: Bar;
    if (info.gameMode === 'hard') {
      bar = {
        y: (CANVAS_HEIGHT - BAR_HARD_H) / 2,
        h: BAR_HARD_H,
        color: info.barColor,
      };
    } else {
      bar = {
        y: (CANVAS_HEIGHT - BAR_BASIC_H) / 2,
        h: BAR_BASIC_H,
        color: info.barColor,
      };
    }
    return bar;
  }
}

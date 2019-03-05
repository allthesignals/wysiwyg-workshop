import Service from '@ember/service';
import { set } from '@ember/object';
import { inject as service } from '@ember-decorators/service';
import { equal } from '@ember-decorators/object/computed';

const HAND_TOOL = {
  name: 'hand',
  icon: 'hand',
  description: 'Tool to move the canvas'
};

const SELECT_TOOL = {
  name: 'select',
  icon: 'select',
  description: 'Tool to select and manipulate layers'
};

const NEW_LAYER_TOOL = {
  name: 'new-layer',
  icon: 'file-add',
  description: 'Tool to create a new layer'
};

export default class CanvasTools extends Service {
  @service layerSelection;
  @service layerState;

  tools = [SELECT_TOOL, HAND_TOOL, NEW_LAYER_TOOL];
  selectedTool = SELECT_TOOL;
  _previousTool = SELECT_TOOL;

  @equal('selectedTool', SELECT_TOOL) isSelectTool;
  @equal('selectedTool', HAND_TOOL) isHandTool;

  chooseHandTool() {
    this.chooseTool(HAND_TOOL);
  }

  chooseSelectTool() {
    this.chooseTool(SELECT_TOOL);
  }

  chooseNewLayerTool() {
    this.chooseTool(NEW_LAYER_TOOL);
  }

  clearTool() {
    set(this, 'selectedTool', this._previousTool);
  }

  chooseTool(tool) {
    this._previousTool = this.selectedTool;
    set(this, 'selectedTool', tool);
  }
}

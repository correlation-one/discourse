import { getOwner } from 'discourse-common/lib/get-owner';
import Composer from "discourse/models/composer";
import Draft from "discourse/models/draft";

export default {
  setupComponent(args, component) {

    let controller = getOwner(this).lookup("controller:discovery/topics");
    let stateModel = controller.get('model');
    let composeController = getOwner(this).lookup('controller:composer');

    if (stateModel && stateModel.get('draft_key')){
      var opts = {
        action: Composer.EDIT,
        draftKey: stateModel.get('draft_key'),
        draft: stateModel.get('draft'), 
        draftSequence: stateModel.get('draft_sequence')      
      };
      loadCollapsedDraft(opts, composeController);

    }
  }
};  

function loadCollapsedDraft(opts, composeController){
  opts = opts || {};

  if (!opts.draftKey) {
    alert("composer was opened without a draft key");
    throw new Error("composer opened without a proper draft key");
  }

  let composerModel = composeController.get("model");

  if (
    opts.ignoreIfChanged &&
    composerModel &&
    composerModel.composeState !== Composer.CLOSED
  ) {
    return;
  }

  composeController.setProperties({
    showEditReason: false,
    editReason: null,
    scopedCategoryId: null
  });

  // If we want a different draft than the current composer, close it and clear our model.
  if (
    composerModel &&
    opts.draftKey !== composerModel.draftKey &&
    composerModel.composeState === Composer.DRAFT
  ) {
    composerModel.close();
    composerModel = null;
  }

  return new Ember.RSVP.Promise(function(resolve, reject) {
    if (composerModel && composerModel.get("replyDirty")) {
      // If we're already open, we don't have to do anything
      if (
        composerModel.get("composeState") === Composer.OPEN &&
        composerModel.get("draftKey") === opts.draftKey &&
        !opts.action
      ) {
        return resolve();
      }

      // If it's the same draft, just open it up again.
      if (
        composerModel.get("composeState") === Composer.DRAFT &&
        composerModel.get("draftKey") === opts.draftKey
      ) {
        composerModel.set("composeState", Composer.OPEN);
        if (!opts.action) return resolve();
      }

      // If it's a different draft, cancel it and try opening again.
      return composerModel
        .cancelComposer()
        .then(function() {
          return composerModel.open(opts);
        })
        .then(resolve, reject);
    }

    return Draft.get(opts.draftKey)
      .then(function(data) {
        _setDraftModel(composerModel, opts, composeController);
      })
      .then(resolve, reject);
  });
}

function _setDraftModel(composerModel, opts, composeController) {
    composeController.set("linkLookup", null);

    if (opts.draft) {
      composerModel = loadDraft(composeController.store, opts);
      if (composerModel) {
        composerModel.set("topic", opts.topic);
      }

    composeController.set("model", composerModel);
    composerModel.set("composeState", Composer.DRAFT);
    composerModel.set("isWarning", false);

    } else {
      composerModel = composerModel || composeController.store.createRecord("composer");
    }

}

function loadDraft(store, opts) {
  opts = opts || {};

  let draft = opts.draft;
  const draftKey = opts.draftKey;
  const draftSequence = opts.draftSequence;

  try {
    if (draft && typeof draft === "string") {
      draft = JSON.parse(draft);
    }
  } catch (error) {
    draft = null;
    Draft.clear(draftKey, draftSequence);
  }
  if (
    draft &&
    ((draft.title && draft.title !== "") || (draft.reply && draft.reply !== ""))
  ) {
    const composer = store.createRecord("composer");
    composer.open({
      draftKey,
      draftSequence,
      action: draft.action,
      title: draft.title,
      categoryId: draft.categoryId || opts.categoryId,
      postId: draft.postId,
      archetypeId: draft.archetypeId,
      reply: draft.reply,
      metaData: draft.metaData,
      usernames: draft.usernames,
      draft: true,
      composerState: Composer.DRAFT,
      composerTime: draft.composerTime,
      typingTime: draft.typingTime,
      whisper: draft.whisper,
      tags: draft.tags,
      noBump: draft.noBump
    });
    return composer;
  }
} 
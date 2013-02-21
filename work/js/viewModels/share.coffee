do ($ = jQuery, ko = window.ko, fc = window.fannect) ->
   
   class fc.viewModels.Share extends fc.viewModels.Base 
      constructor: () -> super
      shareViaTwitter: () -> fc.share.viaTwitter()
      shareViaEmail: () -> fc.share.viaEmail()
      shareViaSMS: () -> fc.share.viaSMS()

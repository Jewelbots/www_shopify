var Twitter,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty,
  slice = [].slice,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

window.AddressesView = (function(superClass) {
  extend(AddressesView, superClass);

  function AddressesView() {
    return AddressesView.__super__.constructor.apply(this, arguments);
  }

  AddressesView.prototype.events = {
    'click .delete-address': 'deleteAddress',
    'click .edit-address': 'editAddress',
    'click .cancel-edit': 'cancelEditing',
    'click .toggle-new-address': 'toggleNewAddress',
    'change .select-wrapper select': 'updateSelectedText'
  };

  AddressesView.prototype.initialize = function() {
    return this.prepareAddresses();
  };

  AddressesView.prototype.prepareAddresses = function() {
    var address, addressID, addresses, j, l, len, len1, results1, select, selectableOptions;
    new Shopify.CountryProvinceSelector('address-country', 'address-province', {
      hideElement: 'address-province-container'
    });
    addresses = this.$('.customer-address');
    if (addresses.length) {
      for (j = 0, len = addresses.length; j < len; j++) {
        address = addresses[j];
        addressID = $(address).data('address-id');
        new Shopify.CountryProvinceSelector("address-country-" + addressID, "address-province-" + addressID, {
          hideElement: "address-province-container-" + addressID
        });
      }
    }
    selectableOptions = this.$('.select-wrapper select');
    results1 = [];
    for (l = 0, len1 = selectableOptions.length; l < len1; l++) {
      select = selectableOptions[l];
      results1.push(this.updateSelectedText(null, select));
    }
    return results1;
  };

  AddressesView.prototype.updateSelectedText = function(e, select) {
    var addressID, selectedValue;
    select = e ? $(e.target) : $(select);
    selectedValue = select.find('option:selected').text();
    if (selectedValue !== '') {
      select.prev('.selected-text').text(selectedValue);
    }
    if (select.attr('name') === 'address[country]') {
      addressID = $(select).attr('id').split('address-country-')[1];
      addressID = addressID ? "#address-province-" + addressID : '.new-address-province';
      return this.updateSelectedText(null, $(addressID));
    }
  };

  AddressesView.prototype.deleteAddress = function(e) {
    var addressID;
    if (e) {
      e.preventDefault();
    }
    addressID = $(e.target).parents('[data-address-id]').data('address-id');
    return Shopify.CustomerAddress.destroy(addressID);
  };

  AddressesView.prototype.editAddress = function(e) {
    var addressID;
    if (e) {
      e.preventDefault();
    }
    addressID = $(e.currentTarget).parents('[data-address-id]').data('address-id');
    $(".customer-address[data-address-id='" + addressID + "']").addClass('editing');
    return $(".customer-address-edit-form[data-address-id='" + addressID + "']").addClass('show');
  };

  AddressesView.prototype.cancelEditing = function(e) {
    var addressID;
    if (e) {
      e.preventDefault();
    }
    addressID = $(e.target).parents('[data-address-id]').data('address-id');
    $(".customer-address[data-address-id='" + addressID + "']").removeClass('editing');
    return $(".customer-address-edit-form[data-address-id='" + addressID + "']").removeClass('show');
  };

  AddressesView.prototype.toggleNewAddress = function(e) {
    if (e) {
      e.preventDefault();
    }
    this.$('.add-new-address').toggle();
    return this.$('.customer-new-address').toggleClass('show');
  };

  AddressesView.prototype.render = function() {};

  return AddressesView;

})(Backbone.View);

window.AccountView = (function(superClass) {
  extend(AccountView, superClass);

  function AccountView() {
    return AccountView.__super__.constructor.apply(this, arguments);
  }

  AccountView.prototype.events = {
    'click .toggle-forgetfulness span': 'recoverPassword'
  };

  AccountView.prototype.initialize = function() {
    if ($(document.body).hasClass('template-customers-addresses')) {
      this.addressesView = new AddressesView({
        el: $('.main-content')
      });
    }
    if ($(document.body).hasClass('template-customers-login')) {
      this.checkForReset();
    }
    if (window.location.hash === '#recover') {
      this.recoverPassword();
    }
    this.mobilifyTables();
    return $(window).resize((function(_this) {
      return function() {
        return _this.mobilifyTables();
      };
    })(this));
  };

  AccountView.prototype.recoverPassword = function() {
    this.$('.recover-password').toggle();
    return this.$('.customer-login').toggle();
  };

  AccountView.prototype.checkForReset = function() {
    if ($('.reset-check').data('successful-reset') === true) {
      return $('.successful-reset').show();
    }
  };

  AccountView.prototype.mobilifyTables = function() {
    return this.$('.orders').mobileTable();
  };

  AccountView.prototype.render = function() {};

  return AccountView;

})(Backbone.View);

window.PostView = (function(superClass) {
  extend(PostView, superClass);

  function PostView() {
    return PostView.__super__.constructor.apply(this, arguments);
  }

  PostView.prototype.events = {};

  PostView.prototype.initialize = function() {
    var highlight, j, len, ref;
    this.setFeaturedImage();
    this.artDirection();
    this.wrapAllNodes();
    ref = this.$('.highlight');
    for (j = 0, len = ref.length; j < len; j++) {
      highlight = ref[j];
      this.fixOverlappingElements($(highlight));
    }
    return $(window).resize((function(_this) {
      return function() {
        var l, len1, ref1, results1;
        _this.setFeaturedImage(true);
        if (window.innerWidth > 1020) {
          ref1 = _this.$('.highlight');
          results1 = [];
          for (l = 0, len1 = ref1.length; l < len1; l++) {
            highlight = ref1[l];
            results1.push(_this.fixOverlappingElements($(highlight)));
          }
          return results1;
        }
      };
    })(this));
  };

  PostView.prototype.wrapAllNodes = function() {
    var childNodes, j, len, node, results1;
    childNodes = this.$('.rte')[0].childNodes;
    results1 = [];
    for (j = 0, len = childNodes.length; j < len; j++) {
      node = childNodes[j];
      if (node.nodeType === 3 && node.textContent.replace(/^\s+|\s+$/g, "")) {
        results1.push($(node).replaceWith("<p>" + node.textContent + "</p>"));
      } else {
        results1.push(void 0);
      }
    }
    return results1;
  };

  PostView.prototype.fixOverlappingElements = function(highlight) {
    if (this.$('.post-meta').overlaps(highlight).length) {
      highlight.addClass('overlapping');
    }
    return highlight.addClass('processed');
  };

  PostView.prototype.setFeaturedImage = function(resize) {
    var contentWidth, featuredImage, parent, windowWidth;
    featuredImage = this.$('.featured-image');
    if (featuredImage.length) {
      parent = featuredImage.parent();
      windowWidth = $(window).width();
      contentWidth = this.$('.post-content').width();
      if (resize) {
        featuredImage.css({
          width: windowWidth,
          marginLeft: -(windowWidth - contentWidth) / 2
        });
        return;
      }
      featuredImage.detach().insertAfter('.page-title').css({
        width: windowWidth,
        marginLeft: -(windowWidth - contentWidth) / 2
      }).addClass('processed');
      if (parent.is(':empty')) {
        return parent.remove();
      }
    }
  };

  PostView.prototype.artDirection = function() {
    var images;
    images = this.$('.post-content').find('img');
    return images.imagesLoaded((function(_this) {
      return function() {
        var direction, image, imageAlt, imageParent, imageWidth, j, len, marginLeft, marginRight, results1;
        results1 = [];
        for (j = 0, len = images.length; j < len; j++) {
          image = images[j];
          image = $(image);
          if (image.parent().hasClass('post-content')) {
            image.wrap('<div />');
          }
          imageParent = image.parent();
          if (image.css('float') !== 'none') {
            direction = image.css('float');
            imageParent.addClass("highlight highlight-" + direction);
            _this.fixOverlappingElements(imageParent);
          }
          imageWidth = image.width();
          imageAlt = image.attr('alt');
          if (imageAlt && imageAlt.length && imageParent.not('img')) {
            marginLeft = image.css('margin-left');
            marginRight = image.css('margin-right');
            results1.push(imageParent.append("<div style='max-width: " + imageWidth + "px; margin-left: " + marginLeft + "; margin-right: " + marginRight + ";' class='photo-caption meta'>" + imageAlt + "</div>"));
          } else {
            results1.push(void 0);
          }
        }
        return results1;
      };
    })(this));
  };

  return PostView;

})(Backbone.View);

window.BlogView = (function(superClass) {
  extend(BlogView, superClass);

  function BlogView() {
    return BlogView.__super__.constructor.apply(this, arguments);
  }

  BlogView.prototype.events = {};

  BlogView.prototype.initialize = function() {
    var j, len, post, ref, results1;
    ref = this.$('.blog-post');
    results1 = [];
    for (j = 0, len = ref.length; j < len; j++) {
      post = ref[j];
      results1.push(new PostView({
        el: post
      }));
    }
    return results1;
  };

  BlogView.prototype.render = function() {};

  return BlogView;

})(Backbone.View);

window.CartView = (function(superClass) {
  extend(CartView, superClass);

  function CartView() {
    return CartView.__super__.constructor.apply(this, arguments);
  }

  CartView.prototype.events = {
    'click .cart-item-decrease': 'updateQuantity',
    'click .cart-item-increase': 'updateQuantity',
    'change .cart-instructions textarea': 'saveSpecialInstructions',
    'click .dismiss': 'closeModal',
    'click .get-rates': 'calculateShipping'
  };

  CartView.prototype.initialize = function() {
    this.sectionBinding();
    return this.render();
  };

  CartView.prototype.render = function() {
    var error;
    this.context = {};
    this.context.cart = JSON.parse($('[data-cart-strings]').text());
    this.context.shipping = null;
    this.modalWrapper = this.$('.cart-modal-wrapper');
    this.modalTitle = this.$('.cart-modal h3');
    this.modalMessage = this.$('.cart-modal-message');
    this.modalAction = this.$('.cart-modal-action');
    this.$shippingCalculator = $('[data-shipping-calculator]');
    if (this.$shippingCalculator.length !== 0) {
      try {
        this.context.shipping = JSON.parse($('[data-shipping-calculator-strings]').text());
      } catch (error1) {
        error = error1;
        console.log('No shipping localisations found, unable to continue.');
      }
      if (this.context.shipping == null) {
        return;
      }
      if (this.context.shipping.customerCountry) {
        this.calculateShipping();
      }
      if (this.$('.cart-items').length) {
        this.shippingCalculator();
      }
    }
    return Shopify.onError = (function(_this) {
      return function(XMLHttpRequest) {
        return _this.handleErrors(XMLHttpRequest);
      };
    })(this);
  };

  CartView.prototype.sectionBinding = function() {
    this.$el.on('shopify:section:load', (function(_this) {
      return function() {
        _this.delegateEvents();
        return _this.initialize();
      };
    })(this));
    return this.$el.on('shopify:section:unload', (function(_this) {
      return function() {
        return _this.undelegateEvents();
      };
    })(this));
  };

  CartView.prototype.saveSpecialInstructions = function() {
    var newNote;
    newNote = $('.cart-instructions textarea').val();
    return Shopify.updateCartNote(newNote, function(cart) {});
  };

  CartView.prototype.updateQuantity = function(e) {
    var action, inventory, message, newQuantity, oldQuantity, productPrice, productQuantity, productRow, productTitle, title, variant;
    productRow = $(e.target).parents('tr');
    productTitle = productRow.find('.cart-title').text();
    productPrice = productRow.find('td.cart-item-total .money');
    productQuantity = productRow.find('.cart-item-quantity-display');
    variant = productRow.data('variant');
    inventory = parseInt(productRow.find('.cart-item-quantity').data('max'), 10);
    oldQuantity = parseInt(productQuantity.val(), 10);
    if ($(e.target).hasClass('cart-item-increase')) {
      newQuantity = oldQuantity + 1;
    } else {
      newQuantity = oldQuantity <= 1 ? 0 : oldQuantity - 1;
    }
    if (newQuantity > inventory) {
      title = this.context.cart.notAvailableText;
      message = this.context.cart.stockLevelText.replace('** stock_count **', inventory);
      action = "<span class='button dismiss'>" + this.context.cart.okayText + "</span>";
      return this.openModal(title, message, action);
    }
    return productRow.find('.cart-item-quantity-display').val(newQuantity);
  };

  CartView.prototype.shippingCalculator = function() {
    var selectableOptions;
    Shopify.Cart.ShippingCalculator.show({
      submitButton: this.context.shipping.submitButton,
      submitButtonDisabled: this.context.shipping.submitButtonProcessing,
      customerIsLoggedIn: this.context.shipping.customerCountry,
      moneyFormat: Theme.moneyFormat
    });
    selectableOptions = this.$shippingCalculator.find('select');
    setTimeout((function(_this) {
      return function() {
        var j, len, results1, select;
        results1 = [];
        for (j = 0, len = selectableOptions.length; j < len; j++) {
          select = selectableOptions[j];
          results1.push(_this.updateShippingLabel(select));
        }
        return results1;
      };
    })(this), 500);
    return this.$('.cart-shipping-calculator select').change((function(_this) {
      return function(e) {
        var j, len, results1, select;
        results1 = [];
        for (j = 0, len = selectableOptions.length; j < len; j++) {
          select = selectableOptions[j];
          results1.push(_this.updateShippingLabel(select));
        }
        return results1;
      };
    })(this));
  };

  CartView.prototype.calculateShipping = function() {
    var shippingAddress;
    $('.get-rates').val(this.context.shipping.submitButtonProcessing);
    shippingAddress = {};
    shippingAddress.zip = $('.address-zip').val() || '';
    shippingAddress.country = $('.address-country').val() || '';
    shippingAddress.province = $('.address-province').val() || '';
    return Shopify.getCartShippingRatesForDestination(shippingAddress, (function(_this) {
      return function() {
        var address, firstRate, j, len, price, rate, rateValues, ratesFeedback, responseText, shippingCalculatorResponse;
        if (shippingAddress.zip.length) {
          address = shippingAddress.zip;
        }
        if (shippingAddress.province.length) {
          address = address + ", " + shippingAddress.province;
        }
        if (shippingAddress.country.length) {
          address = address + ", " + shippingAddress.country;
        }
        shippingCalculatorResponse = $('.cart-shipping-calculator-response');
        shippingCalculatorResponse.empty().append("<p class='shipping-calculator-response message'/><ul class='shipping-rates'/>");
        ratesFeedback = $('.shipping-calculator-response');
        if (rates.length > 1) {
          firstRate = Shopify.Cart.ShippingCalculator.formatRate(rates[0].price);
          responseText = _this.context.shipping.multiRates.replace('** address **', address).replace('** number_of_rates **', rates.length).replace('** rate **', "<span class='money'>" + firstRate + "</span>");
          ratesFeedback.html(responseText);
        } else if (rates.length === 1) {
          responseText = _this.context.shipping.oneRate.replace('** address **', address);
          ratesFeedback.html(responseText);
        } else {
          ratesFeedback.html(_this.context.shipping.noRates);
        }
        for (j = 0, len = rates.length; j < len; j++) {
          rate = rates[j];
          price = Shopify.Cart.ShippingCalculator.formatRate(rate.price);
          rateValues = _this.context.shipping.rateValues.replace('** rate_title **', rate.name).replace('** rate **', "<span class='money'>" + price + "</span>");
          $('.shipping-rates').append("<li>" + rateValues + "</li>");
        }
        return $('.get-rates').val(_this.context.shipping.submitButton);
      };
    })(this));
  };

  CartView.prototype.updateShippingLabel = function(select) {
    var selectedOption;
    if (select) {
      select = $(select);
      selectedOption = select.find('option:selected').val();
      if (!selectedOption) {
        selectedOption = select.prev('.selected-text').data('default');
      }
      select.prev('.selected-text').text(selectedOption);
      return setTimeout((function(_this) {
        return function() {
          if (select.attr('name') === 'address[country]') {
            return _this.updateShippingLabel(_this.$('#address_province'));
          }
        };
      })(this), 500);
    }
  };

  CartView.prototype.openModal = function(title, message, action) {
    this.modalTitle.text(title);
    this.modalMessage.text(message);
    this.modalAction.html(action);
    return this.modalWrapper.addClass('active');
  };

  CartView.prototype.closeModal = function() {
    return this.modalWrapper.removeClass('active');
  };

  CartView.prototype.handleErrors = function(errors) {
    var errorMessage;
    errorMessage = $.parseJSON(errors.responseText);
    if (errorMessage.zip) {
      errorMessage = this.context.shipping.errorMessage.replace('** error_message **', errorMessage.zip);
      return $('.cart-shipping-calculator-response').html("<p>" + errorMessage + "</p>");
    } else {
      return console.log('Error', errorMessage.stringify());
    }
  };

  return CartView;

})(Backbone.View);

window.CollectionView = (function(superClass) {
  extend(CollectionView, superClass);

  function CollectionView() {
    return CollectionView.__super__.constructor.apply(this, arguments);
  }

  CollectionView.prototype.events = {
    'change .collection-tag-selector select': '_browseByTag'
  };

  CollectionView.prototype.initialize = function() {
    return this.sectionBinding();
  };

  CollectionView.prototype.sectionBinding = function() {
    this.$el.on('shopify:section:load', (function(_this) {
      return function() {
        return _this.delegateEvents();
      };
    })(this));
    return this.$el.on('shopify:section:unload', (function(_this) {
      return function() {
        return _this.undelegateEvents();
      };
    })(this));
  };

  CollectionView.prototype._browseByTag = function(e) {
    var fallback, newTag, select;
    select = $(e.target);
    fallback = select.parents(".select-wrapper").find("select").data('fallback-url');
    newTag = select.parents(".select-wrapper").find(':selected').attr('name');
    if (newTag === 'reset') {
      return window.location.href = fallback;
    } else {
      return window.location.href = fallback + "/" + newTag;
    }
  };

  return CollectionView;

})(Backbone.View);

window.NavigationView = (function(superClass) {
  extend(NavigationView, superClass);

  function NavigationView() {
    return NavigationView.__super__.constructor.apply(this, arguments);
  }

  NavigationView.prototype.events = {
    'click .header-drawer .has-dropdown [data-has-dropdown]': 'toggleNavigation'
  };

  NavigationView.prototype.initialize = function() {
    this.$el.on('click.navigation', (function(_this) {
      return function(e) {
        if (!$(e.target).closest('.navigation').length) {
          return _this.$('.navigation .open').removeClass('open');
        }
      };
    })(this));
    this.$el.on('focus.navigation', '.header-navigation-link.primary-link', (function(_this) {
      return function() {
        var $menuWrapper;
        $menuWrapper = $(_this.$el.find('.has-dropdown.open'));
        if ($menuWrapper.length) {
          return $menuWrapper.toggleClass('open', false);
        }
      };
    })(this));
    return this.$el.on('focus.navigation', '[data-is-dropdown] .secondary-link', (function(_this) {
      return function(event) {
        var $target;
        $target = $(event.currentTarget);
        return $target.parents('.has-dropdown').toggleClass('open', true);
      };
    })(this));
  };

  NavigationView.prototype.toggleNavigation = function(e) {
    var $target;
    $target = $(e.target);
    if ($target.parents().hasClass('has-dropdown')) {
      e.preventDefault();
      return $target.parent().toggleClass('open');
    }
  };

  NavigationView.prototype.prepareRemove = function() {
    return this.$el.off('click.navigation').off('focus.navigation', '.header-navigation-link.primary-link').off('focus.navigation', '[data-is-dropdown] .secondary-link');
  };

  return NavigationView;

})(Backbone.View);

window.HeaderView = (function() {
  function HeaderView() {
    this.window = $(window);
    this.$document = $(document.body);
    this.el = '[data-main-header]';
    this.headerLogo = '[data-header-logo]';
    this._init();
  }

  HeaderView.prototype._init = function() {
    this.$el = $(this.el);
    this.$drawerMenu = this.$document.find('[data-header-drawer]');
    this.$mainContent = $('[data-main-content]');
    this.$mainHeader = this.$el.find('[data-header-content]');
    this.$headerLogo = $(this.headerLogo);
    this.$headerGoal = $('.module-header-goal');
    this.$searchWrapper = this.$el.find('[data-header-search]');
    this.headerContentWidth = 0;
    this.slideShow = '[data-section-type=slideshow]';
    this.$slideShow = $(this.slideShow);
    this.isHeaderNavigation = this.$el.attr('data-main-header') === 'header';
    this.hasLogo = this.$el.find(this.headerLogo).length;
    this.isHeaderSticky = this.$el.attr('data-sticky-header') != null;
    this.sectionChanges(this.$slideShow);
    this._bindEvents();
    this.navigation = new NavigationView({
      el: this.$document
    });
    if (this.$headerGoal.length) {
      this.goal = new GoalView({
        el: this.$headerGoal
      });
    }
    if (this.isHeaderNavigation) {
      return this._calculateHeaderWidths();
    }
  };

  HeaderView.prototype._bindEvents = function() {
    this.$document.on('shopify:section:select', (function(_this) {
      return function() {
        return _this.sectionChanges(null);
      };
    })(this)).on('shopify:section:deselect', (function(_this) {
      return function() {
        return _this.sectionChanges(null);
      };
    })(this)).on('click.search', '[data-search-toggle]', (function(_this) {
      return function() {
        return _this._openSearch();
      };
    })(this)).on('blur.search', '.header-search-input', (function(_this) {
      return function() {
        return _this._closeSearch();
      };
    })(this)).on('click.drawer', '[data-drawer-toggle]', (function(_this) {
      return function() {
        return _this._toggleCollapsedNav();
      };
    })(this)).on('calculateHeaderWidths', (function(_this) {
      return function() {
        return _this._calculateHeaderWidths();
      };
    })(this)).on('toggleStickyHeader', (function(_this) {
      return function(event, $slideshow) {
        return _this.stickyHeader($slideshow);
      };
    })(this)).on('toggleSlideShowHeader', (function(_this) {
      return function(event, $slideshow) {
        return _this.slideShowHeader($slideshow);
      };
    })(this));
    return this.window.on('resize.header', (function(_this) {
      return function() {
        return _this._resizeEvents();
      };
    })(this));
  };

  HeaderView.prototype.unBindEvents = function() {
    var ref;
    this.$document.off('.header-search-toggle').off('click.search', '[data-search-toggle]').off('blur.search', '.header-search-input').off('click.drawer', '[data-drawer-toggle]').off('calculateHeaderWidths', this.el).off('toggleStickyHeader', this.el).off('toggleSlideShowHeader', this.el);
    this.navigation.prepareRemove();
    this.navigation.undelegateEvents();
    delete this.navigation;
    if ((ref = this.goal) != null) {
      ref.remove();
    }
    this.window.off('resize.header');
    return this.window.off('scroll.header');
  };

  HeaderView.prototype._resizeEvents = function() {
    this._fitHeader();
    if (this.$document.hasClass('showing-drawer')) {
      return this._toggleCollapsedNav();
    }
  };


  /*
      These events need to fire when any section in the TE is reloaded
   */

  HeaderView.prototype.sectionChanges = function($slideshow) {
    this.stickyHeader($slideshow);
    return this.slideShowHeader($slideshow);
  };

  HeaderView.prototype.stickyHeader = function($slideShow) {
    if ($slideShow == null) {
      $slideShow = $(this.slideShow);
    }
    this.$document.toggleClass('has-sticky-header', this.isHeaderSticky);
    return this.window.on('scroll.header', (function(_this) {
      return function() {
        var scrollPosition;
        scrollPosition = _this.window.scrollTop();
        if (_this.isHeaderSticky) {
          _this.$el.toggleClass('scrolled', scrollPosition > 0);
        }
        if ($slideShow.length) {
          $slideShow.trigger('setSlideshowClasses');
        }
        if ($slideShow.attr('data-full-window-slideshow') != null) {
          scrollPosition = scrollPosition < 0 ? 0 : scrollPosition;
          _this.$el.toggleClass('higher-than-slideshow', scrollPosition === 0);
          return _this.$el.toggleClass('lower-than-slideshow', scrollPosition > 0);
        }
      };
    })(this));
  };

  HeaderView.prototype.slideShowHeader = function($slideShow) {
    if ($slideShow == null) {
      $slideShow = $(this.slideShow);
    }
    if ($slideShow.length && ($slideShow.attr('data-full-window-slideshow') != null)) {
      this.$el.addClass('higher-than-slideshow');
      return this.$document.addClass('has-slideshow-full-window');
    } else {
      this.$el.removeClass('higher-than-slideshow');
      return this.$document.removeClass('has-slideshow-full-window');
    }
  };

  HeaderView.prototype._calculateHeaderWidths = function() {
    return this.$el.imagesLoaded((function(_this) {
      return function() {
        var brandingWidth, logoWidths, toolsWidth;
        brandingWidth = _this.$el.find('.branding').outerWidth(true);
        toolsWidth = _this.$el.find('.header-tools').outerWidth(true);
        if (_this.$headerLogo.length) {
          logoWidths = [];
          _this.$headerLogo.each(function(index, logo) {
            return logoWidths.push($(logo).width());
          });
          brandingWidth = Math.max.apply(Math, logoWidths);
        }
        _this.headerContentWidth = brandingWidth + toolsWidth + 45 + 60;
        return _this._fitHeader();
      };
    })(this));
  };

  HeaderView.prototype._fitHeader = function() {
    var headerWidth;
    headerWidth = this.$mainHeader.width();
    return this.$mainHeader.toggleClass('collapsed-navigation', this.headerContentWidth >= headerWidth);
  };

  HeaderView.prototype._toggleCollapsedNav = function(e) {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    this.$document.toggleClass('showing-drawer');
    if (Modernizr.csstransitions) {
      return this.$el.one('transitionend', (function(_this) {
        return function() {
          return _this.$document.toggleClass('drawer-visible');
        };
      })(this));
    } else {
      return this.$document.toggleClass('drawer-visible');
    }
  };

  HeaderView.prototype._openSearch = function() {
    if (window.innerWidth <= 720) {
      window.location.href = '/search';
      return;
    }
    this.$('.header-search-wrapper').addClass('active').find('input').focus();
    return this.$('.header-search-wrapper').on('keyup.search', (function(_this) {
      return function(e) {
        if (e.keyCode === 27) {
          return _this._closeSearch();
        }
      };
    })(this));
  };

  HeaderView.prototype._closeSearch = function() {
    return this.$('.header-search-wrapper').removeClass('active').off('keyup.search');
  };

  return HeaderView;

})();

window.ZoomView = (function(superClass) {
  extend(ZoomView, superClass);

  function ZoomView() {
    return ZoomView.__super__.constructor.apply(this, arguments);
  }

  ZoomView.prototype.events = {
    'prepare-zoom': 'prepareZoom',
    'click': 'toggleZoom',
    'mouseover .product-image-zoom': 'prepareZoom',
    'mouseout .product-image-zoom': 'toggleZoom',
    'mousemove .product-image-zoom': 'zoomImage'
  };

  ZoomView.prototype.initialize = function() {
    this.zoomArea = this.$('.product-image-zoom');
    this.$newImage = null;
    return this.$el.imagesLoaded((function(_this) {
      return function() {
        return _this.prepareZoom();
      };
    })(this));
  };

  ZoomView.prototype.prepareZoom = function() {
    var highResSrc, newImage;
    highResSrc = this.$el.find('img').attr('data-high-res');
    newImage = new Image();
    this.$newImage = $(newImage);
    this.$newImage.on('load', (function(_this) {
      return function() {
        var imageHeight, imageWidth, photoAreaHeight, photoAreaWidth, ratio, ratios;
        imageWidth = newImage.width;
        imageHeight = newImage.height;
        photoAreaWidth = _this.$el.width();
        photoAreaHeight = _this.$el.height();
        ratios = [];
        ratios.push(imageWidth / photoAreaWidth);
        ratios.push(imageHeight / photoAreaHeight);
        ratio = Math.max.apply(null, ratios);
        if (ratio >= 1 && imageWidth > photoAreaWidth && imageHeight > photoAreaHeight) {
          _this.$el.addClass('zoom-enabled');
          return _this.zoomArea.css({
            backgroundImage: "url('" + highResSrc + "')"
          });
        } else {
          _this.$el.removeClass('zoom-enabled');
        }
      };
    })(this));
    return newImage.src = highResSrc;
  };

  ZoomView.prototype.toggleZoom = function(e) {
    if (!this.$el.hasClass('zoom-enabled')) {
      return;
    }
    if (e.type === 'mouseout') {
      this.zoomArea.removeClass('active');
      this.zoomArea.css({
        backgroundPosition: '50% 50%'
      });
      return;
    }
    if (this.zoomArea.hasClass('active')) {
      this.zoomArea.removeClass('active');
    } else {
      this.zoomArea.addClass('active');
    }
    return this.zoomImage(e);
  };

  ZoomView.prototype.zoomImage = function(e) {
    var bigImageOffset, bigImageX, bigImageY, mousePositionX, mousePositionY, ratioX, ratioY, zoomHeight, zoomWidth;
    zoomWidth = this.zoomArea.width();
    zoomHeight = this.zoomArea.height();
    bigImageOffset = this.$el.offset();
    bigImageX = Math.round(bigImageOffset.left);
    bigImageY = Math.round(bigImageOffset.top);
    mousePositionX = e.pageX - bigImageX;
    mousePositionY = e.pageY - bigImageY;
    if (mousePositionX < zoomWidth && mousePositionY < zoomHeight && mousePositionX > 0 && mousePositionY > 0) {
      if (this.zoomArea.hasClass('active')) {
        ratioY = (e.pageY - bigImageY) / zoomHeight * 100;
        ratioX = (e.pageX - bigImageX) / zoomWidth * 100;
        return this.zoomArea.css({
          backgroundPosition: ratioX + "% " + ratioY + "%"
        });
      }
    }
  };

  ZoomView.prototype.prepareRemove = function() {
    return this.$newImage.off('load');
  };

  return ZoomView;

})(Backbone.View);

window.LinkedOptions = (function() {
  function LinkedOptions(options) {
    this.options = options;
    this._init();
  }

  LinkedOptions.prototype._init = function() {
    return this._mapVariants(this.options.productJSON);
  };

  LinkedOptions.prototype._getCurrent = function(optionIndex) {
    var key, option1, option2, selector;
    if (this.options.type === 'select') {
      switch (optionIndex) {
        case 0:
          key = 'root';
          selector = this.options.$selector.eq(0);
          break;
        case 1:
          key = this.options.$selector.eq(0).val();
          selector = this.options.$selector.eq(1);
          break;
        case 2:
          key = (this.options.$selector.eq(0).val()) + " / " + (this.options.$selector.eq(1).val());
          selector = this.options.$selector.eq(2);
      }
    }
    if (this.options.type === 'radio') {
      switch (optionIndex) {
        case 0:
          key = 'root';
          selector = this.options.$selector.filter('[data-option-index=0]').filter(':checked');
          break;
        case 1:
          key = this.options.$selector.filter('[data-option-index=0]').filter(':checked').val();
          selector = this.options.$selector.filter('[data-option-index=1]').filter(':checked');
          break;
        case 2:
          option1 = this.options.$selector.filter('[data-option-index=0]').filter(':checked').val();
          option2 = this.options.$selector.filter('[data-option-index=1]').filter(':checked').val();
          key = option1 + " / " + option2;
          selector = this.options.$selector.filter('[data-option-index=2]').filter(':checked');
      }
    }
    return {
      key: key,
      selector: selector
    };
  };

  LinkedOptions.prototype._updateOptions = function(optionIndex, optionsMap) {
    var $nextOption, $option, $selector, $selectorOptions, availableOptions, initialValue, j, key, l, len, len1, nextSelector, option, ref, selector, updateSelected;
    nextSelector = optionIndex + 1;
    updateSelected = false;
    ref = this._getCurrent(optionIndex), key = ref.key, selector = ref.selector;
    availableOptions = optionsMap[key] || [];
    if (this.options.type === 'select') {
      $selector = this.options.$productForm.find(selector);
      initialValue = $selector.val();
      $selectorOptions = $selector.find('option');
      for (j = 0, len = $selectorOptions.length; j < len; j++) {
        option = $selectorOptions[j];
        $option = $(option);
        if (availableOptions.indexOf(option.value) === -1) {
          if (option.selected) {
            updateSelected = true;
          }
          $option.prop('disabled', true).prop('selected', false);
        } else {
          $option.prop('disabled', false);
        }
      }
      if (availableOptions.indexOf(initialValue) !== -1) {
        $selector.val(initialValue);
      }
      if (updateSelected) {
        $selectorOptions.filter(':not(:disabled)').eq(0).prop('selected', true);
      }
    }
    if (this.options.type === 'radio') {
      $selector = this.options.$selector.filter("[data-option-index=" + optionIndex + "]");
      for (l = 0, len1 = $selector.length; l < len1; l++) {
        option = $selector[l];
        $option = $(option);
        if (availableOptions.indexOf(option.value) === -1) {
          if (option.checked) {
            updateSelected = true;
          }
          $option.prop('disabled', true).prop('checked', false);
        } else {
          $option.prop('disabled', false);
        }
      }
      if (updateSelected) {
        $selector.filter(':not(:disabled)').eq(0).attr('checked', true).trigger('click');
      }
    }
    $selector.trigger('change');
    $nextOption = this.options.$selector.filter("[data-option-index=" + nextSelector + "]");
    if ($nextOption.length !== 0) {
      return this._updateOptions(nextSelector, optionsMap);
    }
  };

  LinkedOptions.prototype._mapVariants = function(product) {
    var j, key, len, optionsMap, ref, variant;
    optionsMap = [];
    optionsMap['root'] = [];
    ref = product.variants;
    for (j = 0, len = ref.length; j < len; j++) {
      variant = ref[j];
      if (variant.available) {
        optionsMap['root'].push(variant.option1);
        optionsMap['root'] = window.ThemeUtils.unique(optionsMap['root']);
        if (product.options.length > 1) {
          key = variant.option1;
          optionsMap[key] = optionsMap[key] || [];
          optionsMap[key].push(variant.option2);
          optionsMap[key] = window.ThemeUtils.unique(optionsMap[key]);
        }
        if (product.options.length > 2) {
          key = variant.option1 + " / " + variant.option2;
          optionsMap[key] = optionsMap[key] || [];
          optionsMap[key].push(variant.option3);
          optionsMap[key] = window.ThemeUtils.unique(optionsMap[key]);
        }
      }
    }
    this._updateOptions(0, optionsMap);
    return this.options.$selector.on('change', (function(_this) {
      return function(event) {
        var index, nextSelector;
        index = parseInt($(event.currentTarget).attr('data-option-index'), 10);
        nextSelector = index + 1;
        return _this._updateOptions(nextSelector, optionsMap);
      };
    })(this));
  };

  LinkedOptions.prototype.prepareRemove = function() {
    return this.options.$selector.off('change');
  };

  return LinkedOptions;

})();

window.ThemeUtils = {
  debounce: function(func, threshold, execAsap) {
    var timeout;
    timeout = false;
    return function() {
      var args, delayed, obj;
      obj = this;
      args = arguments;
      delayed = function() {
        if (!execAsap) {
          func.apply(obj, args);
        }
        return timeout = null;
      };
      if (timeout) {
        clearTimeout(timeout);
      } else if (execAsap) {
        func.apply(obj, args);
      }
      return timeout = setTimeout(delayed, threshold || 100);
    };
  },
  scrollTarget: function($el) {
    var $stickyHeader, offset;
    if (!($el instanceof jQuery)) {
      $el = $($el);
    }
    offset = $el.offset().top;
    $stickyHeader = $('[data-sticky-header]');
    if ($stickyHeader.length && window.innerWidth >= 720) {
      offset = offset - $stickyHeader.outerHeight();
    }
    return $('html, body').animate({
      scrollTop: offset
    }, 500, 'linear');
  },
  extend: function() {
    var dest, j, k, len, obj, objs, v;
    dest = arguments[0], objs = 2 <= arguments.length ? slice.call(arguments, 1) : [];
    for (j = 0, len = objs.length; j < len; j++) {
      obj = objs[j];
      for (k in obj) {
        v = obj[k];
        dest[k] = v;
      }
    }
    return dest;
  },
  unique: function(array) {
    var j, key, output, ref, results1, value;
    output = {};
    for (key = j = 0, ref = array.length; 0 <= ref ? j < ref : j > ref; key = 0 <= ref ? ++j : --j) {
      output[array[key]] = array[key];
    }
    results1 = [];
    for (key in output) {
      value = output[key];
      results1.push(value);
    }
    return results1;
  }
};

window.VariantHelper = (function() {
  function VariantHelper(options) {
    var defaultOptions, isShopify;
    defaultOptions = {
      $addToCartButton: null,
      $priceFields: null,
      $productForm: null,
      $productThumbnails: null,
      $selector: null,
      type: 'select',
      productJSON: null,
      productSettings: null
    };
    this.options = window.ThemeUtils.extend(defaultOptions, options);
    this.$body = $(document.body);
    this.linkedOptions = null;
    this.enableHistory = false;
    this.$masterSelect = this.options.$productForm.find("#product-select-" + this.options.formID);
    isShopify = window.Shopify && window.Shopify.preview_host;
    if (window.history && window.history.replaceState && this.options.productSettings.enableHistory && !isShopify) {
      this.enableHistory = true;
    }
    this._init();
    this._bindEvents();
  }

  VariantHelper.prototype._init = function() {
    var j, len, ref, select;
    if (this.options.type === 'select') {
      ref = this.options.$selector;
      for (j = 0, len = ref.length; j < len; j++) {
        select = ref[j];
        this._setSelectLabel(null, $(select));
      }
    }
    if (this.options.productSettings.linkedOptions) {
      this.linkedOptions = new LinkedOptions(this.options);
    }
    return this._updateCurrency();
  };

  VariantHelper.prototype._bindEvents = function() {
    return this.options.$selector.on('change', (function(_this) {
      return function(event) {
        return _this._variantChange(event);
      };
    })(this));
  };

  VariantHelper.prototype._setSelectLabel = function(event, $target) {
    var selectedOption;
    if (event == null) {
      event = null;
    }
    if ($target == null) {
      $target = false;
    }
    if (!$target) {
      $target = $(event.currentTarget);
    }
    selectedOption = $target.find('option:selected').val();
    return $target.prev('[data-select-text]').find('[data-selected-option]').text(selectedOption.replace('+', ''));
  };

  VariantHelper.prototype._getCurrentOptions = function() {
    var $inputs, productOptions;
    productOptions = [];
    $inputs = this.options.$selector;
    if (this.options.type === 'radio') {
      $inputs = $inputs.filter(':checked');
    }
    $inputs.each(function(index, element) {
      return productOptions.push($(element).val());
    });
    return productOptions;
  };

  VariantHelper.prototype._getVariantFromOptions = function(productOptions) {
    var foundVariant, isMatch, j, len, ref, variant;
    if (this.options.productJSON.variants == null) {
      return;
    }
    foundVariant = null;
    ref = this.options.productJSON.variants;
    for (j = 0, len = ref.length; j < len; j++) {
      variant = ref[j];
      isMatch = productOptions.every(function(value) {
        return variant.options.indexOf(value) !== -1;
      });
      if (isMatch) {
        foundVariant = variant;
      }
    }
    return foundVariant;
  };

  VariantHelper.prototype._updateMasterSelect = function(variant) {
    var ref;
    if (variant == null) {
      return;
    }
    if ((ref = this.$masterSelect.find("[data-variant-id=" + variant.id + "]")) != null) {
      ref.prop('selected', true);
    }
    return this.$masterSelect.trigger('change');
  };

  VariantHelper.prototype._updatePrice = function(variant) {
    var $addToCartButton, $amountSaved, $displayPrice, $originalPrice, $priceComparison, $priceFields, productSettings;
    $addToCartButton = this.options.$addToCartButton;
    $priceFields = this.options.$priceFields;
    productSettings = this.options.productSettings;
    $displayPrice = $priceFields.find('.money:first-child');
    $originalPrice = $priceFields.find('.original');
    $amountSaved = $priceFields.find('.saving-result');
    $priceComparison = $priceFields.find('.product-price-compare');
    if (variant != null) {
      if (variant.available) {
        $addToCartButton.val(productSettings.addToCartText).removeClass('disabled').removeAttr('disabled');
      } else {
        $addToCartButton.val(productSettings.soldOutText).addClass('disabled').attr('disabled', 'disabled');
      }
      if (variant.compare_at_price > variant.price) {
        $displayPrice.html(Shopify.formatMoney(variant.price, Theme.moneyFormat));
        $originalPrice.html(Shopify.formatMoney(6900, Theme.moneyFormat));
        $amountSaved.html(Shopify.formatMoney(6900 - variant.price, Theme.moneyFormat) + ' per Jewelbot');
        $priceComparison.show();
      } else {
        $displayPrice.html(Shopify.formatMoney(variant.price, Theme.moneyFormat));
        $originalPrice.html(Shopify.formatMoney(6900, Theme.moneyFormat));
        $amountSaved.html(Shopify.formatMoney(6900 - variant.price, Theme.moneyFormat) + ' per Jewelbot');
        $priceComparison.show();
      }
    } else {
      $addToCartButton.val(productSettings.unavailableText).addClass('disabled').attr('disabled', 'disabled');
    }
    return this._updateCurrency();
  };

  VariantHelper.prototype._updateImages = function(variant) {
    var index, ref;
    index = variant != null ? (ref = variant.featured_image) != null ? ref.position : void 0 : void 0;
    if (index == null) {
      return;
    }
    return this.options.$productThumbnails.eq(index - 1).trigger('click');
  };

  VariantHelper.prototype._updateHistory = function(variant) {
    var newUrl, variantUrl;
    if (!(this.enableHistory && (variant != null))) {
      return;
    }
    newUrl = [window.location.protocol, '//', window.location.host, window.location.pathname, '?variant=', variant.id];
    variantUrl = newUrl.join('');
    return window.history.replaceState({
      path: variantUrl
    }, '', variantUrl);
  };

  VariantHelper.prototype._variantChange = function(event) {
    var productOptions, variant;
    if (this.options.type === 'select') {
      this._setSelectLabel(event);
    }
    productOptions = this._getCurrentOptions();
    variant = this._getVariantFromOptions(productOptions);
    this._updateMasterSelect(variant);
    this._updatePrice(variant);
    this._updateImages(variant);
    return this._updateHistory(variant);
  };

  VariantHelper.prototype._updateCurrency = function() {
    if (Theme.currencySwitcher) {
      return this.$body.trigger('reset-currency');
    }
  };

  VariantHelper.prototype.prepareRemove = function() {
    var ref;
    this.options.$selector.off('change');
    return (ref = this.linkedOptions) != null ? ref.prepareRemove() : void 0;
  };

  return VariantHelper;

})();

window.ImagePreloader = (function() {

  /*
      @param images
          {object} containing URLS to images
      @param size
          {string} containing image size to return images as
   */
  function ImagePreloader(images, size) {
    this.images = images;
    this.size = size;
    this._init();
  }

  ImagePreloader.prototype._init = function() {
    var image, j, len, ref, results1;
    ref = this.images;
    results1 = [];
    for (j = 0, len = ref.length; j < len; j++) {
      image = ref[j];
      results1.push(this._loadImage(this._getSizedImageURL(image, this.size)));
    }
    return results1;
  };


  /*
      Retrieves the URI for a specified image based on an image size
   */

  ImagePreloader.prototype._getSizedImageURL = function(segment, size) {
    var dateElements, image_id, segmentMatch;
    if (size === 'master') {
      return this.removeProtocol(segment);
    }
    segmentMatch = segment.match(/\.(jpg|jpeg|gif|png|bmp|bitmap|tiff|tif)(\?v=\d+)?$/i);
    if (segmentMatch == null) {
      return null;
    }
    image_id = segmentMatch[0];
    dateElements = segment.split(image_id);
    return this._removeProtocol(dateElements[0] + "_" + size + image_id);
  };


  /*
      Remove the http/https from an image URL
   */

  ImagePreloader.prototype._removeProtocol = function(segment) {
    return segment.replace(/http(s)?:/, '');
  };


  /*
      Cache the image as a JS Object to load it into memory
   */

  ImagePreloader.prototype._loadImage = function(path) {
    return (new Image).src = path;
  };

  return ImagePreloader;

})();

window.ProductView = (function(superClass) {
  extend(ProductView, superClass);

  function ProductView() {
    return ProductView.__super__.constructor.apply(this, arguments);
  }

  ProductView.prototype.events = {
    "click .product-slideshow-pagination-item": "updateProductImage",
    "submit .product-form": "addToCart",
    "click .product-tabs-header-item": "tabs",
    "click .product-slideshow-navigation": "navigate",
    "click .number-input-nav-item": "amount"
  };

  ProductView.prototype.initialize = function() {
    this.sectionBinding();
    return this.render();
  };

  ProductView.prototype.render = function() {
    var $productJSON, $productSettings;
    this.$productForm = $('[data-product-form]', this.$el);
    this.formID = this.$productForm.attr('data-product-form');
    this.processing = false;
    this.$productSlideshowNavigation = $('.product-slideshow-navigation');
    this.productForm = "product-form-" + this.formID;
    this.$productThumbnails = $('.product-thumbnails a', this.$el);
    this.$productImage = $('.product-big-image', this.$el);
    this.$addToCartButton = $('.add-to-cart input', this.$el);
    this.$priceArea = $('.product-price', this.$el);
    this.$productMessage = $('[data-product-message]', this.$el);
    $productJSON = $("[data-product-json-" + this.formID + "]", this.$el);
    $productSettings = $("[data-product-settings-" + this.formID + "]", this.$el);
    if (!$productJSON.length) {
      return;
    }
    this.productJSON = JSON.parse($productJSON.text());
    this.productSettings = JSON.parse($productSettings.text());
    this.$variantDropdowns = $("[data-option-select=" + this.formID + "]", this.$el);
    this.options = this.productJSON.options;
    this.variants = this.productJSON.variants;
    this.noImageURL = this.$(".product-big-image").data("no-image-svg");
    if ($("html").hasClass("no-svg")) {
      this.noImageURL = this.$(".product-big-image").data("no-image-png");
    }
    if (this.productSettings.imageZoom) {
      this.zoomView = new ZoomView({
        el: this.$productImage
      });
    }
    if (Theme.currencySwitcher) {
      this.switchCurrency();
    }
    if (this.$variantDropdowns.length) {
      this.setupVariants();
    }
    this.cacheImages();
    Shopify.onError = (function(_this) {
      return function(XMLHttpRequest) {
        return _this.handleErrors(XMLHttpRequest);
      };
    })(this);
    return this.$productSlideshowNavigation.on("mouseout.productSlideshow", (function(_this) {
      return function(event) {
        return $(event.currentTarget).blur();
      };
    })(this));
  };

  ProductView.prototype.sectionBinding = function() {
    this.$el.on('shopify:section:load', (function(_this) {
      return function(event) {
        if (!$(event.target).hasClass('section-product')) {
          return;
        }
        _this.delegateEvents();
        return _this.render();
      };
    })(this));
    return this.$el.on('shopify:section:unload', (function(_this) {
      return function(event) {
        var ref, ref1, ref2;
        if (!$(event.target).hasClass('section-product')) {
          return;
        }
        _this.undelegateEvents();
        _this.$productSlideshowNavigation.off("mouseout.productSlideshow");
        if ((ref = _this.variantHelpers) != null) {
          ref.prepareRemove();
        }
        if ((ref1 = _this.zoomView) != null) {
          ref1.prepareRemove();
        }
        return (ref2 = _this.zoomView) != null ? ref2.remove() : void 0;
      };
    })(this));
  };

  ProductView.prototype.setupVariants = function() {
    var dropdownSettings;
    dropdownSettings = {
      $addToCartButton: this.$addToCartButton,
      $priceFields: this.$priceArea,
      $productForm: this.$productForm,
      $productThumbnails: this.$productThumbnails,
      $selector: this.$variantDropdowns,
      formID: this.formID,
      productSettings: this.productSettings,
      productJSON: this.productJSON,
      type: 'select'
    };
    return this.variantHelpers = new VariantHelper(dropdownSettings);
  };

  ProductView.prototype.switchCurrency = function() {
    return $(document.body).trigger("reset-currency");
  };

  ProductView.prototype.cacheImages = function() {
    if (this.productJSON.images.length) {
      new ImagePreloader(this.productJSON.images, '2048x2048');
      return new ImagePreloader(this.productJSON.images, '600x600');
    }
  };

  ProductView.prototype.updateProductImage = function(e, index) {
    var $target, highSrc, newAlt, newSrc;
    if (e) {
      e.preventDefault();
    }
    this.$(".product-slideshow-pagination-item.active").removeClass("active");
    $target = e ? $(e.currentTarget) : this.$(".product-thumbnails .product-slideshow-pagination-item").eq(index);
    newSrc = $target.data("default-res");
    highSrc = $target.data("high-res");
    newAlt = $target.data("alt");
    $target.addClass("active");
    this.$(".product-big-image img").removeClass("product-no-images").attr("src", newSrc).attr("data-high-res", highSrc).attr("alt", newAlt);
    if (this.productSettings.imageZoom) {
      return setTimeout((function(_this) {
        return function() {
          return _this.$productImage.trigger("prepare-zoom");
        };
      })(this), 200);
    }
  };

  ProductView.prototype.addToCart = function(e) {
    var quantity;
    if (this.productSettings.disableAjaxAddProduct) {
      return;
    }
    e.preventDefault();
    if (this.processing) {
      return;
    }
    this.processing = true;
    if (Modernizr.cssanimations) {
      this.$(".add-to-cart").addClass("loading");
    } else {
      this.$addToCartButton.val(this.productSettings.processingText);
    }
    quantity = this.$("input[name='quantity']").val();
    if (quantity === "" || quantity === "0") {
      return setTimeout((function(_this) {
        return function() {
          _this.$("input[name='quantity']").addClass("error");
          _this.$productMessage.text(_this.productSettings.setQuantityText);
          _this.$(".add-to-cart").removeClass("loading added-success").addClass("added-error");
          return _this.processing = false;
        };
      })(this), 500);
    } else {
      return Shopify.addItemFromForm(this.productForm, (function(_this) {
        return function(cartItem) {
          return setTimeout(function() {
            var successMessage;
            Shopify.getCart(function(cart) {
              return $(".cart-link .cart-count").text(cart.item_count);
            });
            successMessage = _this.productSettings.successMessage.replace('** product **', "<em>" + cartItem.title + "</em>");
            _this.$productMessage.html(successMessage);
            _this.$("input[name='quantity']").removeClass("error");
            _this.$(".add-to-cart").removeClass("loading added-error").addClass("added-success");
            $(".header-cart-count").addClass("active");
            if (!Modernizr.cssanimations) {
              _this.$addToCartButton.val(Theme.addToCartText);
            }
            return _this.processing = false;
          }, 1000);
        };
      })(this));
    }
  };

  ProductView.prototype.handleErrors = function(errors) {
    var errorDescription, errorMessage, productTitle, ref;
    errorMessage = $.parseJSON(errors.responseText);
    productTitle = this.productJSON.title;
    errorDescription = errorMessage.description;
    if (((ref = errorMessage.description) != null ? ref.indexOf(productTitle) : void 0) > -1) {
      errorDescription = errorDescription.replace(productTitle, "<em>" + productTitle + "</em>");
    }
    if (errorMessage.message === "Cart Error") {
      return setTimeout((function(_this) {
        return function() {
          _this.$("input[name='quantity']").removeClass("error");
          _this.$productMessage.html(errorDescription);
          _this.$(".add-to-cart").removeClass("loading added-success").addClass("added-error");
          if (!Modernizr.cssanimations) {
            _this.$addToCartButton.val(_this.productSettings.addToCartText);
          }
          return _this.processing = false;
        };
      })(this), 1000);
    }
  };

  ProductView.prototype.tabs = function(e) {
    var body_target, target;
    target = $(e.currentTarget).attr("data-tab");
    body_target = $(e.currentTarget).parents(".product-tabs").find("#" + target);
    $(e.currentTarget).addClass("active").siblings().removeClass("active");
    return body_target.addClass("active").siblings().removeClass("active");
  };

  ProductView.prototype.navigate = function(e) {
    var index, target, total;
    if (e) {
      e.preventDefault();
    }
    total = this.$(".product-slideshow-pagination-item").size() - 1;
    index = this.$(".product-slideshow-pagination-item.active").index();
    if (this.$(e.currentTarget).hasClass("product-slideshow-next")) {
      if (index === total) {
        target = 0;
      } else {
        target = this.$(".product-slideshow-pagination-item.active").next().index();
      }
    } else {
      if (index === 0) {
        target = total;
      } else {
        target = this.$(".product-slideshow-pagination-item.active").prev().index();
      }
    }
    return this.updateProductImage(false, target);
  };

  ProductView.prototype.amount = function(e) {
    var input, result;
    input = $(e.currentTarget).parents(".number-input-wrapper").find('input');
    result = parseFloat(input.val());
    if ($(e.currentTarget).hasClass("icon-plus")) {
      return input.val(result + 1);
    } else {
      if (result > 0) {
        return input.val(result - 1);
      }
    }
  };

  return ProductView;

})(Backbone.View);

window.SlideshowView = (function(superClass) {
  extend(SlideshowView, superClass);

  function SlideshowView() {
    return SlideshowView.__super__.constructor.apply(this, arguments);
  }

  SlideshowView.prototype.events = {
    'click .home-slideshow-previous': 'previousSlide',
    'click .home-slideshow-next': 'nextSlide',
    'click .home-slideshow-pagination > span': 'specificSlide',
    'mouseenter': 'pauseLoop',
    'mouseleave': 'startLoop',
    'setSlideshowClasses': 'setSlideshowClasses'
  };

  SlideshowView.prototype.initialize = function() {
    this.$document = $(document.body);
    this.$window = $(window);
    this.$headerNavigation = $('[data-main-header]');
    this.$slideShow = this.$el.find('[data-slideshow-content]');
    this.slideText = '';
    this.autoplayInterval = null;
    this.slidesLocked = false;
    this.autoplay = this.$el.attr('data-slideshow-autoplay') != null;
    this.isFullWindow = this.$el.attr('data-full-window-slideshow') != null;
    this.$slideNavigation = this.$('.home-slideshow-navigation');
    this.$slidePagination = this.$('.home-slideshow-pagination');
    this.ltIE9 = $('html').hasClass('lt-ie9');
    this.$slideNavigation.on('mouseout.slideshowNavigation', (function(_this) {
      return function(event) {
        return $(event.currentTarget).blur();
      };
    })(this));
    this.transitionend = (function(transition) {
      var transEndEventNames;
      transEndEventNames = {
        "-webkit-transition": "webkitTransitionEnd",
        "-moz-transition": "transitionend",
        "-o-transition": "oTransitionEnd",
        transition: "transitionend"
      };
      return transEndEventNames[transition];
    })(Modernizr.prefixed("transition"));
    this.setupSlides();
    return this.setupHeader();
  };

  SlideshowView.prototype.setSlideshowClasses = function(event, $slide) {
    var slideText;
    if (event == null) {
      event = null;
    }
    if ($slide) {
      slideText = $slide.data('slide-text');
    } else {
      slideText = this.$slideShow.find('.active').data('slide-text');
    }
    if (slideText !== this.slideText) {
      this.$document.removeClass('slide-color-light slide-color-dark').addClass("slide-color-" + slideText);
      return this.slideText = slideText;
    }
  };

  SlideshowView.prototype.setupHeader = function() {
    return this.$document.trigger("toggleStickyHeader", [this.$el]).trigger("toggleSlideShowHeader", [this.$el]);
  };

  SlideshowView.prototype.setupSlides = function() {
    var paginationWidth, windowHeight, windowWidth;
    this.$slides = this.$el.find('[data-slide]');
    this.slideCount = this.$slides.length;
    this.setSlideshowClasses(null, this.$slides.eq(0));
    if (this.ltIE9) {
      paginationWidth = this.$slidePagination.width();
      this.$slidePagination.css({
        marginLeft: -(paginationWidth / 2)
      });
    }
    windowWidth = window.innerWidth || document.documentElement.clientWidth;
    windowHeight = window.innerHeight || document.documentElement.clientHeight;
    this.$el.imagesLoaded((function(_this) {
      return function() {
        var i, image, imageHeight, j, len, ref, slide, slideHeight, slideID, slideText, textHeight, textWidth;
        ref = _this.$slides;
        for (i = j = 0, len = ref.length; j < len; i = ++j) {
          slide = ref[i];
          slide = $(slide);
          slideID = slide.attr('id');
          if (_this.isFullWindow && windowWidth > 720) {
            imageHeight = windowHeight;
            slide.height(imageHeight);
            if (_this.ltIE9) {
              slide.css('background-image', '').find('img').show().height(imageHeight);
            }
          } else {
            image = slide.find('.slide-image');
            imageHeight = image.height();
          }
          slide.data('height', imageHeight);
          slideHeight = windowWidth <= 720 ? slide.height() : imageHeight;
          if (_this.ltIE9) {
            slideText = slide.find('.slide-text');
            textHeight = slideText.height();
            slideText.css({
              marginTop: -(textHeight / 2)
            });
            if (slide.hasClass('text-aligned-center')) {
              textWidth = slideText.outerWidth();
              slideText.css({
                marginLeft: -(textWidth / 2)
              });
            }
          }
          if (i === 0) {
            slide.addClass('active');
            _this.$el.height(slideHeight);
            _this.setNavHeight(imageHeight);
            _this.$el.attr('id', "viewing-" + slideID);
          }
          if (i + 1 === _this.slideCount) {
            _this.$el.addClass('slides-ready');
          }
        }
        return _this.$window.on('resize.slideshow', function() {
          return _this.resetSlideHeights();
        });
      };
    })(this));
    return this.startLoop();
  };

  SlideshowView.prototype.resetSlideHeights = function() {
    var image, imageHeight, j, len, ref, results1, slide, slideHeight, windowHeight, windowWidth;
    windowWidth = window.innerWidth || document.documentElement.clientWidth;
    windowHeight = window.innerHeight || document.documentElement.clientHeight;
    ref = this.$slides;
    results1 = [];
    for (j = 0, len = ref.length; j < len; j++) {
      slide = ref[j];
      slide = $(slide);
      if (this.isFullWindow && windowWidth > 720) {
        imageHeight = windowHeight;
        slide.height(imageHeight);
      } else {
        image = slide.find('.slide-image');
        imageHeight = image.height();
        slide.css('height', '');
      }
      slide.data('height', imageHeight);
      slideHeight = windowWidth <= 720 ? slide.height() : imageHeight;
      if (slide.hasClass('active')) {
        this.$el.height(slideHeight);
        results1.push(this.setNavHeight(imageHeight));
      } else {
        results1.push(void 0);
      }
    }
    return results1;
  };

  SlideshowView.prototype.resetPaginationPosition = function(height) {
    var windowWidth;
    windowWidth = window.innerWidth || document.documentElement.clientWidth;
    if (windowWidth <= 720) {
      return this.$slidePagination.css({
        bottom: 'auto',
        top: height - 50
      });
    } else {
      return this.$slidePagination.css({
        bottom: 0,
        top: 'auto'
      });
    }
  };

  SlideshowView.prototype.previousSlide = function(e) {
    if (this.sliding) {
      return;
    }
    this.showNewSlide('prev');
    return e.preventDefault();
  };

  SlideshowView.prototype.nextSlide = function(e) {
    if (this.sliding) {
      return;
    }
    this.showNewSlide('next');
    if (e) {
      return e.preventDefault();
    }
  };

  SlideshowView.prototype.specificSlide = function(e) {
    var nextSlideID;
    if (!$(e.currentTarget).hasClass('active')) {
      nextSlideID = $(e.currentTarget).data('slide-id');
      return this.showNewSlide('next', nextSlideID);
    }
  };

  SlideshowView.prototype.updateSlidePagination = function(index) {
    this.$slidePagination.find('.active').removeClass('active');
    return this.$slidePagination.find('> span').eq(index).addClass('active');
  };

  SlideshowView.prototype.lockSlide = function(event) {
    this.slidesLocked = true;
    this.pauseLoop();
    return this.showNewSlide('next', event.target.id);
  };

  SlideshowView.prototype.unlockSlide = function() {
    this.slidesLocked = false;
    return this.startLoop();
  };

  SlideshowView.prototype.showNewSlide = function(type, specificSlide) {
    var $activeSlide, $nextSlide, called, direction, fallback, imageHeight, slideHeight, slideID, windowWidth;
    this.sliding = true;
    called = false;
    if (this.$slides.length === 1) {
      this.sliding = false;
      return;
    }
    direction = type === 'next' ? 'left' : 'right';
    fallback = type === 'next' ? 'first' : 'last';
    $activeSlide = this.$slideShow.find('.active');
    $nextSlide = specificSlide ? this.$("#" + specificSlide) : $activeSlide[type]();
    $nextSlide = $nextSlide.length ? $nextSlide : this.$slides[fallback]();
    if ($activeSlide.attr('id') === $nextSlide.attr('id')) {
      return;
    }
    $nextSlide.addClass(type);
    $nextSlide[0].offsetWidth;
    $activeSlide.addClass(direction);
    $nextSlide.addClass(direction);
    if ($('html').hasClass('lt-ie10')) {
      $nextSlide.removeClass([type, direction].join(' ')).addClass('active');
      $activeSlide.removeClass(['active', direction].join(' '));
      this.sliding = false;
    } else {
      $nextSlide.one(this.transitionend, (function(_this) {
        return function() {
          called = true;
          $nextSlide.removeClass([type, direction].join(' ')).addClass('active');
          $activeSlide.removeClass(['active', direction].join(' '));
          return _this.sliding = false;
        };
      })(this));
      setTimeout((function(_this) {
        return function() {
          if (!called) {
            return $nextSlide.trigger(_this.transitionend);
          }
        };
      })(this), 700);
    }
    imageHeight = $nextSlide.data('height');
    this.updateSlidePagination($nextSlide.index());
    this.setNavHeight(imageHeight);
    this.setSlideshowClasses(null, $nextSlide);
    windowWidth = window.innerWidth || document.documentElement.clientWidth;
    slideHeight = windowWidth <= 720 ? $nextSlide.height() : imageHeight;
    slideID = $nextSlide.attr('id');
    this.$el.attr('id', "viewing-" + slideID);
    return this.$el.height(slideHeight);
  };

  SlideshowView.prototype.startLoop = function() {
    if (!(this.autoplay && !this.slidesLocked)) {
      return;
    }
    return this.autoplayInterval = setInterval((function(_this) {
      return function() {
        return _this.nextSlide();
      };
    })(this), 7000);
  };

  SlideshowView.prototype.pauseLoop = function() {
    if (this.autoplayInterval == null) {
      return;
    }
    return clearInterval(this.autoplayInterval);
  };

  SlideshowView.prototype.setNavHeight = function(imageHeight) {
    imageHeight = this.isFullWindow && $(window).width() > 720 ? imageHeight + 60 : imageHeight;
    return this.$slideNavigation.css({
      lineHeight: imageHeight + "px"
    });
  };

  SlideshowView.prototype.prepareRemove = function() {
    this.$window.off('resize.slideshow');
    return this.$slideNavigation.off('mouseout.slideshowNavigation');
  };

  return SlideshowView;

})(Backbone.View);

window.ImagesWithTextView = (function(superClass) {
  extend(ImagesWithTextView, superClass);

  function ImagesWithTextView() {
    return ImagesWithTextView.__super__.constructor.apply(this, arguments);
  }

  ImagesWithTextView.prototype.events = {
    'click .product-details-slideshow-nav-list-item': 'specificSlide'
  };

  ImagesWithTextView.prototype.initialize = function() {
    this.slidePagination = this.$('.product-details-slideshow-nav-list');
    this.ltIE9 = $('html').hasClass('lt-ie9');
    this.slidePagination.children().first().addClass('active');
    return this.$el.find('.product-details-slideshow-list-item').first().addClass('active');
  };

  ImagesWithTextView.prototype.specificSlide = function(event) {
    var index;
    event.preventDefault();
    if (!$(event.currentTarget).hasClass('active')) {
      index = $(event.currentTarget).attr('data-position');
      return this.updateSlidePagination(index);
    }
  };

  ImagesWithTextView.prototype.updateSlidePagination = function(index) {
    this.$el.find('.product-details-slideshow-nav-list-item').removeClass('active');
    this.$el.find(".product-details-slideshow-nav-list-item[data-position='" + index + "']").addClass('active');
    return this.showNewSlide(index);
  };

  ImagesWithTextView.prototype.showNewSlide = function(index) {
    return this.$el.find(".product-details-slideshow-list-item[data-position='" + index + "']").addClass('active').focus().siblings().removeClass('active');
  };

  return ImagesWithTextView;

})(Backbone.View);

window.TestimonialView = (function(superClass) {
  extend(TestimonialView, superClass);

  function TestimonialView() {
    return TestimonialView.__super__.constructor.apply(this, arguments);
  }

  TestimonialView.prototype.events = {
    "click .home-testimonials-pagination-list-item": "paginate",
    "click .home-testimonials-navigation-item a": "navigate"
  };

  TestimonialView.prototype.initialize = function() {
    var count, slide;
    this.slideList = this.$(".home-testimonials-slides-list");
    this.pageList = this.$(".home-testimonials-pagination-list");
    this.$window = $(window);
    this.$navigationItem = this.$('.home-testimonials-navigation-item a');
    slide = this.slideList.children();
    count = this.slideList.children().length;
    if (count > 1) {
      slide.last().clone().removeAttr("data-position").addClass("cloned").prependTo(this.slideList);
      slide.first().clone().removeAttr("data-position").addClass("cloned").appendTo(this.slideList);
    } else {
      this.slideList.parents(".home-testimonials").addClass("static");
    }
    this.slideHeight(1);
    this.slideWidth();
    if (count > 1) {
      this.slideRotate(1);
    }
    this.slideList.parents(".home-testimonials").addClass("ready");
    this.$window.on('resize.testimonials', (function(_this) {
      return function() {
        var index;
        index = _this.slideList.children(".active").attr("data-position");
        _this.slideHeight(index);
        _this.slideWidth();
        if (count > 1) {
          return _this.slideAnim(index);
        }
      };
    })(this));
    return this.$navigationItem.on('mouseout.testimonials', (function(_this) {
      return function(event) {
        return $(event.currentTarget).blur();
      };
    })(this));
  };

  TestimonialView.prototype.slideHeight = function(index) {
    return this.slideList.height(this.slideList.children("div[data-position='" + index + "']").height());
  };

  TestimonialView.prototype.slideWidth = function() {
    this.slideList.width(this.slideList.parent().width() * this.slideList.children().length);
    return this.slideList.children().width(this.slideList.parent().width());
  };

  TestimonialView.prototype.slideAnim = function(index) {
    return this.slideList.css({
      "margin-left": -index * this.slideList.parent().width()
    });
  };

  TestimonialView.prototype.slideRotate = function(index) {
    this.slideList.children().removeClass("active");
    this.pageList.children().removeClass("active");
    this.slideList.children("div[data-position='" + index + "']").addClass("active");
    this.pageList.children("div[data-position='" + index + "']").addClass("active");
    return this.slideAnim(index);
  };

  TestimonialView.prototype.paginate = function(event, index) {
    if (event == null) {
      event = false;
    }
    if (index == null) {
      index = false;
    }
    if ($(event.currentTarget).hasClass('active') && !index) {
      return;
    }
    if (event && !index) {
      index = $(event.currentTarget).attr('data-position');
    }
    this.slideRotate(index);
    return this.slideHeight(index);
  };

  TestimonialView.prototype.navigate = function(event) {
    var $navigation, index;
    if (event) {
      event.preventDefault();
    }
    $navigation = $(event.currentTarget).parent('div');
    if ($navigation.hasClass("next-slide")) {
      if (!this.slideList.children(".active").next().hasClass("cloned")) {
        index = this.slideList.children(".active").next().attr("data-position");
      } else {
        index = 1;
      }
    }
    if ($navigation.hasClass("previous-slide")) {
      if (!this.slideList.children(".active").prev().hasClass("cloned")) {
        index = this.slideList.children(".active").prev().attr("data-position");
      } else {
        index = this.slideList.children().length - 2;
      }
    }
    this.slideRotate(index);
    return this.slideHeight(index);
  };

  TestimonialView.prototype.prepareRemove = function() {
    this.$navigationItem.off('mouseout.testimonials');
    return this.$window.off('resize.testimonials');
  };

  return TestimonialView;

})(Backbone.View);

window.VideoView = (function(superClass) {
  extend(VideoView, superClass);

  function VideoView() {
    return VideoView.__super__.constructor.apply(this, arguments);
  }

  VideoView.prototype.events = {
    'click [data-overlay-play]': 'activateVideo'
  };

  VideoView.prototype.initialize = function() {
    return this.$el.fitVids();
  };

  VideoView.prototype.activateVideo = function(event) {
    var $overlay, $target, $video, $videoWrapper;
    $target = $(event.currentTarget);
    $videoWrapper = $target.parents('[data-video-wrapper]');
    $overlay = $videoWrapper.find('[data-video-overlay]');
    $video = $videoWrapper.find('iframe');
    if (!$video.length) {
      return;
    }
    $videoWrapper.addClass("active");
    setTimeout((function(_this) {
      return function() {
        return $overlay.addClass('inactive');
      };
    })(this), 200);
    return setTimeout((function(_this) {
      return function() {
        var $videoSrc, $videoSrcNew, delimiter;
        $videoSrc = $video.attr('src');
        delimiter = ($videoSrc != null ? $videoSrc.indexOf('?') : void 0) === -1 ? '?' : '&';
        $videoSrcNew = ($videoSrc + delimiter) + "autoplay=1";
        $video.attr('src', $videoSrcNew);
        return $overlay.remove();
      };
    })(this), 400);
  };

  return VideoView;

})(Backbone.View);

window.HomeView = (function(superClass) {
  extend(HomeView, superClass);

  function HomeView() {
    return HomeView.__super__.constructor.apply(this, arguments);
  }

  HomeView.prototype.initialize = function() {
    this.$homeOrderNow = this.$('.home-order-now');
    this.$homeTestimonials = this.$('.home-testimonials');
    return this.sectionBinding();
  };

  HomeView.prototype.render = function() {
    if (this.$homeOrderNow.length) {
      return new ProductView({
        el: this.$homeOrderNow
      });
    }
  };

  HomeView.prototype.sectionBinding = function() {
    this.sections = new ThemeEditor();
    this.sections.register('slideshow', this.slideShow(this.sections));
    this.sections.register('full-width-feature', this.fullWidthFeature(this.sections));
    this.sections.register('alternating-content', this.alternatingContent(this.sections));
    this.sections.register('images-with-text', this.imagesWithText(this.sections));
    return this.sections.register('testimonials', this.testimonials(this.sections));
  };

  HomeView.prototype.slideShow = function(sections) {
    return {
      instances: {},
      el: '[data-section-type="slideshow"]',
      init: function(instance) {
        return this.instances[instance.sectionId] = new SlideshowView({
          el: $(this.el)
        });
      },
      onSectionLoad: function(event) {
        var instance;
        instance = sections.getInstance(event);
        if (!this.instances[instance.sectionId]) {
          return this.init(instance);
        }
      },
      onSectionUnload: function(event) {
        var instance;
        instance = sections.getInstance(event);
        this.instances[instance.sectionId].setupHeader();
        this.instances[instance.sectionId].prepareRemove();
        this.instances[instance.sectionId].setSlideshowClasses(null);
        this.instances[instance.sectionId].remove();
        return delete this.instances[instance.sectionId];
      },
      onSectionSelect: function(event) {
        var instance;
        instance = sections.getInstance(event);
        this.instances[instance.sectionId].setupHeader();
        return this.instances[instance.sectionId].setSlideshowClasses(null);
      },
      onBlockSelect: function(event) {
        var instanceHandler;
        instanceHandler = this.instances[sections.getInstance(event).sectionId];
        return instanceHandler.lockSlide(event);
      },
      onBlockDeselect: function(event) {
        var instanceHandler;
        instanceHandler = this.instances[sections.getInstance(event).sectionId];
        return instanceHandler.unlockSlide();
      }
    };
  };

  HomeView.prototype.fullWidthFeature = function(sections) {
    return {
      instances: {},
      init: function(instance) {
        var $video;
        $video = instance.$container.find('[data-video-wrapper]');
        if ($video.length) {
          return this.instances[instance.sectionId] = new VideoView({
            el: $video
          });
        } else {
          return this.instances[instance.sectionId] = null;
        }
      },
      onSectionLoad: function(event) {
        var instance;
        instance = sections.getInstance(event);
        if (!this.instances[instance.sectionId]) {
          return this.init(instance);
        }
      },
      onSectionUnload: function(event) {
        var instance, ref;
        instance = sections.getInstance(event);
        if ((ref = this.instances[instance.sectionId]) != null) {
          ref.remove();
        }
        return delete this.instances[instance.sectionId];
      }
    };
  };

  HomeView.prototype.alternatingContent = function(sections) {
    return {
      instances: {},
      init: function(instance) {
        var $video;
        $video = instance.$container.find('[data-video-wrapper]');
        if ($video.length) {
          return this.instances[instance.sectionId] = new VideoView({
            el: $video
          });
        } else {
          return this.instances[instance.sectionId] = null;
        }
      },
      onSectionLoad: function(event) {
        var instance;
        instance = sections.getInstance(event);
        if (!this.instances[instance.sectionId]) {
          return this.init(instance);
        }
      },
      onSectionUnload: function(event) {
        var instance, ref;
        instance = sections.getInstance(event);
        if ((ref = this.instances[instance.sectionId]) != null) {
          ref.remove();
        }
        return delete this.instances[instance.sectionId];
      },
      onBlockSelect: function(event) {
        return window.ThemeUtils.scrollTarget($(event.target));
      }
    };
  };

  HomeView.prototype.imagesWithText = function(sections) {
    return {
      instances: {},
      init: function(instance) {
        return this.instances[instance.sectionId] = new ImagesWithTextView({
          el: instance.$container
        });
      },
      onSectionLoad: function(event) {
        var instance;
        instance = sections.getInstance(event);
        if (!this.instances[instance.sectionId]) {
          return this.init(instance);
        }
      },
      onSectionUnload: function(event) {
        var instance;
        instance = sections.getInstance(event);
        this.instances[instance.sectionId].remove();
        return delete this.instances[instance.sectionId];
      },
      onBlockSelect: function(event) {
        var instance;
        instance = sections.getInstance(event);
        return this.instances[instance.sectionId].updateSlidePagination($(event.target).attr('data-position'));
      }
    };
  };

  HomeView.prototype.testimonials = function(sections) {
    return {
      instances: {},
      init: function(instance) {
        return this.instances[instance.sectionId] = new TestimonialView({
          el: instance.$container
        });
      },
      onSectionLoad: function(event) {
        var instance;
        instance = sections.getInstance(event);
        if (!this.instances[instance.sectionId]) {
          return this.init(instance);
        }
      },
      onSectionUnload: function(event) {
        var instance;
        instance = sections.getInstance(event);
        this.instances[instance.sectionId].prepareRemove();
        this.instances[instance.sectionId].remove();
        return delete this.instances[instance.sectionId];
      },
      onBlockSelect: function(event) {
        var index, instance;
        instance = sections.getInstance(event);
        index = $(event.target).attr('data-index');
        return this.instances[instance.sectionId].paginate(false, index);
      }
    };
  };

  return HomeView;

})(Backbone.View);

window.GiftCardView = (function(superClass) {
  extend(GiftCardView, superClass);

  function GiftCardView() {
    return GiftCardView.__super__.constructor.apply(this, arguments);
  }

  GiftCardView.prototype.initialize = function() {
    return this.addQrCode();
  };

  GiftCardView.prototype.addQrCode = function() {
    var qrWrapper;
    qrWrapper = $('[data-qr-code]');
    return new QRCode(qrWrapper[0], {
      text: qrWrapper.data('qr-code'),
      width: 120,
      height: 120
    });
  };

  return GiftCardView;

})(Backbone.View);

window.ListCollectionsView = (function(superClass) {
  extend(ListCollectionsView, superClass);

  function ListCollectionsView() {
    return ListCollectionsView.__super__.constructor.apply(this, arguments);
  }

  ListCollectionsView.prototype.events = {};

  ListCollectionsView.prototype.initialize = function() {
    var collection, collectionDetails, collections, j, len, results1;
    if ($('html').hasClass('lt-ie9')) {
      collections = this.$('.collection-list-item');
      results1 = [];
      for (j = 0, len = collections.length; j < len; j++) {
        collection = collections[j];
        collectionDetails = $(collection).find('.collection-details');
        results1.push(this.verticallyAlignText(collectionDetails));
      }
      return results1;
    }
  };

  ListCollectionsView.prototype.verticallyAlignText = function(collectionDetails) {
    var textHeight;
    textHeight = collectionDetails.height();
    return collectionDetails.css({
      marginTop: -(textHeight / 2)
    });
  };

  ListCollectionsView.prototype.render = function() {};

  return ListCollectionsView;

})(Backbone.View);

window.AccordionView = (function(superClass) {
  extend(AccordionView, superClass);

  function AccordionView() {
    return AccordionView.__super__.constructor.apply(this, arguments);
  }

  AccordionView.prototype.events = {
    'click [data-accordion-trigger]': '_toggle'
  };

  AccordionView.prototype.initialize = function() {
    this.accordionContent = '[data-accordion-content]';
    this.accordionTrigger = '[data-accordion-trigger]';
    return this.activeAccordion = 'accordion-active';
  };

  AccordionView.prototype._toggle = function(event) {
    var $content, $target, trigger;
    event.preventDefault();
    $target = $(event.currentTarget);
    trigger = $target.attr('data-accordion-trigger');
    $content = $("[data-accordion-content=" + trigger + "]");
    if ($target.hasClass(this.activeAccordion)) {
      return this._close($target, $content);
    } else {
      this._closeAll();
      return this._open($target, $content);
    }
  };

  AccordionView.prototype._closeAll = function() {
    return $(this.accordionTrigger).each((function(_this) {
      return function(index, accordion) {
        var $target;
        $target = $(accordion);
        if ($target.hasClass(_this.activeAccordion)) {
          return $target.trigger('click');
        }
      };
    })(this));
  };

  AccordionView.prototype._open = function($target, $content) {
    return $content.slideDown({
      duration: 400,
      start: (function(_this) {
        return function() {
          return $target.addClass(_this.activeAccordion);
        };
      })(this)
    });
  };

  AccordionView.prototype._close = function($target, $content) {
    return $content.slideUp({
      duration: 400,
      start: (function(_this) {
        return function() {
          return $target.removeClass(_this.activeAccordion);
        };
      })(this)
    });
  };

  AccordionView.prototype.onBlockSelect = function(event) {
    var $container, $target;
    $container = $(event.target);
    $target = $container.find(this.accordionTrigger);
    if (!$target.hasClass(this.activeAccordion)) {
      $target.trigger('click');
      return setTimeout((function(_this) {
        return function() {
          return window.ThemeUtils.scrollTarget($container);
        };
      })(this), 400);
    }
  };

  return AccordionView;

})(Backbone.View);

window.GoogleMapView = (function(superClass) {
  extend(GoogleMapView, superClass);

  function GoogleMapView() {
    this._getGoogleInfoBoxScript = bind(this._getGoogleInfoBoxScript, this);
    return GoogleMapView.__super__.constructor.apply(this, arguments);
  }

  GoogleMapView.prototype.initialize = function() {
    this.mapCanvas = '[data-google-map]';
    this.$mapCanvas = this.$el.find(this.mapCanvas);
    this.context = JSON.parse(this.$el.find('[data-google-map-json]').text());
    this.infoBoxURL = this.$mapCanvas.data("infobox-url");
    return this._getGoogleScript();
  };

  GoogleMapView.prototype._getGoogleScript = function() {
    var googleMapsURL;
    if (this.context.apiKey.length) {
      googleMapsURL = "//maps.googleapis.com/maps/api/js?key=" + this.context.apiKey;
    } else {
      googleMapsURL = '//maps.googleapis.com/maps/api/js';
    }
    if (typeof window.google === 'undefined') {
      return $.getScript(googleMapsURL).done((function(_this) {
        return function(script, textStatus) {
          return _this._getGoogleInfoBoxScript(textStatus);
        };
      })(this)).fail((function(_this) {
        return function(jqxhr, settings, exception) {
          return _this._scriptFailed('GoogleMaps', {
            jqxhr: jqxhr,
            settings: settings,
            exception: exception
          });
        };
      })(this));
    } else {
      return this._getGoogleInfoBoxScript('success');
    }
  };

  GoogleMapView.prototype._getGoogleInfoBoxScript = function(textStatus) {
    if (textStatus !== 'success') {
      return this._scriptFailed('GoogleMaps');
    }
    return $.getScript(this.infoBoxURL).done((function(_this) {
      return function(script, textStatus) {
        return _this._infoBoxLoaded(textStatus);
      };
    })(this)).fail((function(_this) {
      return function(jqxhr, settings, exception) {
        return _this._scriptFailed('Infobox', {
          jqxhr: jqxhr,
          settings: settings,
          exception: exception
        });
      };
    })(this));
  };

  GoogleMapView.prototype._scriptFailed = function(scriptName, options) {
    if (options == null) {
      options = {};
    }
    console.warn(scriptName + " failed to load");
    if (options != null) {
      return console.warn(options);
    }
  };

  GoogleMapView.prototype._hasErrors = function(status) {
    var errorMessage;
    switch (status) {
      case 'ZERO_RESULTS':
        errorMessage = this.context.addressNoResults;
        break;
      case 'OVER_QUERY_LIMIT':
        errorMessage = this.context.addressQueryLimit;
        break;
      default:
        errorMessage = this.context.addressError;
    }
    return this.$mapCanvas.append("<div class=\"module-map-error\">" + errorMessage + "</div>");
  };

  GoogleMapView.prototype._infoBoxLoaded = function(textStatus) {
    if (textStatus !== 'success') {
      return this._scriptFailed('Infobox');
    }
    this.geocoder = new google.maps.Geocoder;
    return this.geocoder.geocode({
      "address": this.context.address
    }, (function(_this) {
      return function(results, status) {
        var infobox, map, mapOptions, marker, stylesArray;
        if (status !== google.maps.GeocoderStatus.OK) {
          return _this._hasErrors(status);
        }
        _this.$el.addClass('has-map');
        stylesArray = [
          {
            'featureType': 'administrative',
            'elementType': 'labels.text.fill',
            'stylers': [
              {
                'color': '#444444'
              }
            ]
          }, {
            'featureType': 'landscape',
            'elementType': 'all',
            'stylers': [
              {
                'color': '#f2f2f2'
              }
            ]
          }, {
            'featureType': 'poi',
            'elementType': 'all',
            'stylers': [
              {
                'visibility': 'off'
              }
            ]
          }, {
            'featureType': 'road',
            'elementType': 'all',
            'stylers': [
              {
                'saturation': -100
              }, {
                'lightness': 45
              }
            ]
          }, {
            'featureType': 'road.highway',
            'elementType': 'all',
            'stylers': [
              {
                'visibility': 'simplified'
              }
            ]
          }, {
            'featureType': 'road.arterial',
            'elementType': 'labels.icon',
            'stylers': [
              {
                'visibility': 'off'
              }
            ]
          }, {
            'featureType': 'transit',
            'elementType': 'all',
            'stylers': [
              {
                'visibility': 'off'
              }
            ]
          }, {
            'featureType': 'water',
            'elementType': 'all',
            'stylers': [
              {
                'color': '#419bf9'
              }, {
                'visibility': 'on'
              }
            ]
          }
        ];
        mapOptions = {
          center: {
            lat: results[0].geometry.location.lat(),
            lng: results[0].geometry.location.lng()
          },
          zoom: 15,
          styles: stylesArray,
          scrollwheel: false
        };
        map = new google.maps.Map(document.querySelector(_this.mapCanvas), mapOptions);
        marker = new google.maps.Marker({
          position: mapOptions.center
        });
        marker.setMap(map);
        infobox = new InfoBox({
          content: "<div class='info-box-container'>" + _this.context.title + "</div>",
          disableAutoPan: false,
          pixelOffset: new google.maps.Size(0, -120),
          zIndex: null,
          closeBoxURL: "",
          infoBoxClearance: new google.maps.Size(1, 1)
        });
        infobox.open(map, marker);
        return google.maps.event.addDomListener(window, 'resize', function() {
          return setTimeout((function(_this) {
            return function() {
              return map.setCenter(mapOptions.center);
            };
          })(this), 100);
        });
      };
    })(this));
  };

  return GoogleMapView;

})(Backbone.View);

window.ThemeEditor = (function(superClass) {
  extend(ThemeEditor, superClass);

  function ThemeEditor() {
    return ThemeEditor.__super__.constructor.apply(this, arguments);
  }

  ThemeEditor.prototype.initialize = function() {
    this.instanceHandlers = {};
    this.instances = {};
    return $(document).on('shopify:section:load', (function(_this) {
      return function(event) {
        return _this._onSectionLoad(event);
      };
    })(this)).on('shopify:section:unload', (function(_this) {
      return function(event) {
        return _this._onSectionUnload(event);
      };
    })(this)).on('shopify:section:select', (function(_this) {
      return function(event) {
        return _this._onSectionSelect(event);
      };
    })(this)).on('shopify:section:deselect', (function(_this) {
      return function(event) {
        return _this._onSectionDeselect(event);
      };
    })(this)).on('shopify:block:select', (function(_this) {
      return function(event) {
        return _this._onBlockSelect(event);
      };
    })(this)).on('shopify:block:deselect', (function(_this) {
      return function(event) {
        return _this._onBlockDeselect(event);
      };
    })(this));
  };

  ThemeEditor.prototype._findInstance = function(event) {
    var $container, instance;
    instance = this.instances[event.originalEvent.detail.sectionId];
    if (instance != null) {
      return instance;
    } else {
      $container = $('[data-section-id]', event.target);
      return this._createInstance($container);
    }
  };

  ThemeEditor.prototype._createInstance = function($container, instanceHandler) {
    var instance, sectionId, sectionType;
    sectionType = $container.attr('data-section-type');
    sectionId = $container.attr('data-section-id');
    if (sectionType == null) {
      return;
    }
    instanceHandler = instanceHandler || this.instanceHandlers[sectionType];
    instance = {
      instanceHandler: instanceHandler,
      $container: $container,
      sectionId: sectionId
    };
    this.instances[sectionId] = instance;
    return instance;
  };


  /*
      Action: A section has been added or re-rendered.
      Expected: Re-execute any JavaScript needed for the section to work and
          display properly (as if the page had just been loaded).
   */

  ThemeEditor.prototype._onSectionLoad = function(event) {
    var $container, ref, ref1;
    $container = $('[data-section-id]', event.target);
    if (!$container.length) {
      return;
    }
    return (ref = this._createInstance($container)) != null ? (ref1 = ref.instanceHandler) != null ? typeof ref1.onSectionLoad === "function" ? ref1.onSectionLoad(event) : void 0 : void 0 : void 0;
  };


  /*
      Action: A section has been deleted or is being re-rendered.
      Expected: Clean up any event listeners, variables, etc., so that
          nothing breaks when the page is interacted with and no memory leaks occur.
   */

  ThemeEditor.prototype._onSectionUnload = function(event) {
    var instance, ref;
    instance = this._findInstance(event);
    if (instance != null) {
      if ((ref = instance.instanceHandler) != null) {
        if (typeof ref.onSectionUnload === "function") {
          ref.onSectionUnload(event);
        }
      }
    }
    if (instance) {
      return delete this.instances[instance.sectionId];
    }
  };


  /*
      Action: User has selected the section in the sidebar.
      Expected: Make sure the section is in view and stays
          in view while selected (scrolling happens automatically).
      Example: Could be used to pause a slideshow
   */

  ThemeEditor.prototype._onSectionSelect = function(event) {
    var ref, ref1;
    return (ref = this._findInstance(event)) != null ? (ref1 = ref.instanceHandler) != null ? typeof ref1.onSectionSelect === "function" ? ref1.onSectionSelect(event) : void 0 : void 0 : void 0;
  };


  /*
      Action: User has deselected the section in the sidebar.
      Expected: (None)
      Example: Could be used to restart slideshows that are no longer being interacted with.
   */

  ThemeEditor.prototype._onSectionDeselect = function(event) {
    var ref, ref1;
    return (ref = this._findInstance(event)) != null ? (ref1 = ref.instanceHandler) != null ? typeof ref1.onSectionDeselect === "function" ? ref1.onSectionDeselect(event) : void 0 : void 0 : void 0;
  };


  /*
      Action: User has selected the block in the sidebar.
      Expected: Make sure the block is in view and stays
          in view while selected (scrolling happens automatically).
      Example: Can be used to to trigger a slideshow to bring a slide/block into view
   */

  ThemeEditor.prototype._onBlockSelect = function(event) {
    var ref, ref1;
    return (ref = this._findInstance(event)) != null ? (ref1 = ref.instanceHandler) != null ? typeof ref1.onBlockSelect === "function" ? ref1.onBlockSelect(event) : void 0 : void 0 : void 0;
  };


  /*
      Action: User has deselected the block in the sidebar.
      Expected: (None)
      Example: Resume a slideshow
   */

  ThemeEditor.prototype._onBlockDeselect = function(event) {
    var ref, ref1;
    return (ref = this._findInstance(event)) != null ? (ref1 = ref.instanceHandler) != null ? typeof ref1.onBlockDeselect === "function" ? ref1.onBlockDeselect(event) : void 0 : void 0 : void 0;
  };


  /*
      Auto initialisation of a section for the store front
   */

  ThemeEditor.prototype._sectionInit = function(instance) {
    var ref;
    return instance != null ? (ref = instance.instanceHandler) != null ? typeof ref.init === "function" ? ref.init(instance) : void 0 : void 0 : void 0;
  };


  /*
      Registration of a section
          - Takes a string parameter as the first argument which
            matches to `[data-section-type]`
  
       * Example
          @sections = new Sections()
          @sections.register('some-section-type', @someSectionClass)
   */

  ThemeEditor.prototype.register = function(type, instanceHandler) {

    /*
        Storage of a instanceHandler based on the sectionType allows _onSectionLoad
           to connect a new section to it's registered instanceHandler
     */
    this.instanceHandlers[type] = instanceHandler;
    return $("[data-section-type=" + type + "]").each((function(_this) {
      return function(index, container) {
        var $container;
        $container = $(container);
        return _this._sectionInit(_this._createInstance($container, instanceHandler));
      };
    })(this));
  };


  /*
      Public method to retrieve information on an instance based on the
      bubbled `event`
   */

  ThemeEditor.prototype.getInstance = function(event) {
    return this._findInstance(event);
  };

  return ThemeEditor;

})(Backbone.View);

window.PageView = (function(superClass) {
  extend(PageView, superClass);

  function PageView() {
    return PageView.__super__.constructor.apply(this, arguments);
  }

  PageView.prototype.initialize = function() {
    this.sections = new ThemeEditor();
    this.sections.register('map', this.mapSection(this.sections));
    return this.sections.register('faq', this.accordionView(this.sections));
  };

  PageView.prototype.accordionView = function(sections) {
    return {
      instances: {},
      init: function(instance) {
        return this.instances[instance.sectionId] = new AccordionView({
          el: instance.$container
        });
      },
      onSectionLoad: function(event) {
        var instance, sectionId;
        instance = sections.getInstance(event);
        sectionId = instance.sectionId;
        if (this.instances[sectionId] == null) {
          return this.init(instance);
        }
      },
      onSectionUnload: function(event) {
        var sectionId;
        sectionId = sections.getInstance(event).sectionId;
        this.instances[sectionId].remove();
        return delete this.instances[sectionId];
      },
      onBlockSelect: function(event) {
        return this.instances[sections.getInstance(event).sectionId].onBlockSelect(event);
      }
    };
  };

  PageView.prototype.mapSection = function(sections) {
    return {
      instances: {},
      init: function(instance) {
        return this.instances[instance.sectionId] = new GoogleMapView({
          el: instance.$container
        });
      },
      onSectionLoad: function(event) {
        var instance, sectionId;
        instance = sections.getInstance(event);
        sectionId = instance.sectionId;
        if (this.instances[sectionId] == null) {
          return this.init(instance);
        }
      },
      onSectionUnload: function(event) {
        var sectionId;
        sectionId = sections.getInstance(event).sectionId;
        this.instances[sectionId].remove();
        return delete this.instances[sectionId];
      }
    };
  };

  return PageView;

})(Backbone.View);

window.PasswordView = (function(superClass) {
  extend(PasswordView, superClass);

  function PasswordView() {
    return PasswordView.__super__.constructor.apply(this, arguments);
  }

  PasswordView.prototype.events = {
    "click .password-entry": "togglePasswordForm",
    "submit .password-embedded-newsletter-form": "toggleNewsletterSuccess"
  };

  PasswordView.prototype.initialize = function() {
    this.toggle = this.$(".password-entry");
    this.subscribeWrapper = this.$(".password-subscribe-wrapper");
    this.passwordWrapper = this.$(".password-form-wrapper");
    this.newsletterInput = ".newsletter-input";
    this.emailRegEx = new RegExp(/^((?!\.)[a-z0-9._%+-]+(?!\.)\w)@[a-z0-9-\.]+\.[a-z.]{2,5}(?!\.)\w$/i);
    $(window).on("load resize", window.ThemeUtils.debounce(this.setContentHeight, 100));
    if (this.$("[data-password-form-inner]").hasClass("has-errors")) {
      return this.togglePasswordForm();
    }
  };

  PasswordView.prototype.toggleNewsletterSuccess = function(event) {
    if (this.emailRegEx.test(this.$(this.newsletterInput).val())) {
      this.$(".password-embedded-newsletter-form").addClass("hidden");
      return this.$(".form-success.hidden").removeClass("hidden");
    } else {
      return event.preventDefault();
    }
  };

  PasswordView.prototype.togglePasswordForm = function() {
    this.passwordWrapper.add(this.subscribeWrapper).toggleClass("visible");
    if (this.passwordWrapper.hasClass("visible")) {
      return this.toggle.text(this.toggle.data("cancel"));
    } else {
      return this.toggle.text(this.toggle.data("enter-password"));
    }
  };

  PasswordView.prototype.setContentHeight = function() {
    var contentHeight, footer, footerHeight, headerHeight, windowHeight;
    footer = this.$(".footer-wrapper");
    windowHeight = $(window).height();
    headerHeight = this.$(".main-header-wrapper").outerHeight(true);
    footerHeight = footer.outerHeight(true);
    contentHeight = this.$(".main-content").outerHeight(true);
    if (windowHeight > headerHeight + contentHeight + footerHeight) {
      return footer.css({
        "position": "fixed"
      });
    } else {
      return footer.css({
        "position": "relative"
      });
    }
  };

  return PasswordView;

})(Backbone.View);

window.RTEView = (function(superClass) {
  extend(RTEView, superClass);

  function RTEView() {
    return RTEView.__super__.constructor.apply(this, arguments);
  }

  RTEView.prototype.events = {
    'click .tabs li': 'switchTabs',
    'change .select-wrapper select': 'updateOption'
  };

  RTEView.prototype.initialize = function() {
    var j, len, select, selects;
    this.setupTabs();
    selects = this.$el.find('select');
    for (j = 0, len = selects.length; j < len; j++) {
      select = selects[j];
      if (!$(select).parent('.select-wrapper').length) {
        $(select).wrap('<div class="select-wrapper" />').parent().prepend('<span class="selected-text"></span>');
      }
      this.updateOption(null, select);
    }
    this.$el.fitVids();
    this.mobilifyTables();
    return $(window).resize((function(_this) {
      return function() {
        return _this.mobilifyTables();
      };
    })(this));
  };

  RTEView.prototype.switchTabs = function(e) {
    var position, tab;
    e.preventDefault();
    tab = $(e.currentTarget);
    position = tab.index();
    this.tabs.removeClass('active');
    this.tabsContent.removeClass('active');
    tab.addClass('active');
    return this.tabsContent.eq(position).addClass('active');
  };

  RTEView.prototype.setupTabs = function() {
    this.tabs = this.$('.tabs > li');
    this.tabsContent = this.$('.tabs-content > li');
    if (!this.tabs.first().hasClass('active')) {
      this.tabs.first().addClass('active');
    }
    if (!this.tabsContent.first().hasClass('active')) {
      return this.tabsContent.first().addClass('active');
    }
  };

  RTEView.prototype.updateOption = function(e, selector) {
    var newOption, select;
    select = e ? $(e.target) : $(selector);
    newOption = select.find('option:selected').text();
    return select.siblings('.selected-text').text(newOption);
  };

  RTEView.prototype.mobilifyTables = function() {
    return this.$el.find('table').mobileTable();
  };

  return RTEView;

})(Backbone.View);

window.SelectView = (function(superClass) {
  extend(SelectView, superClass);

  function SelectView() {
    return SelectView.__super__.constructor.apply(this, arguments);
  }

  SelectView.prototype.events = {
    "change": "updateSelectText",
    "blur": "blurSelect",
    "focus": "focusSelect"
  };

  SelectView.prototype.initialize = function() {
    if (!(this.$el.parent(".select-wrapper").length || this.$el.hasClass("product-select"))) {
      this.$el.wrap("<div class='select-wrapper' />").parent().prepend("<span class='selected-text'></span>");
    }
    return this.updateSelectText();
  };

  SelectView.prototype.blurSelect = function() {
    return this.$el.parent(".select-wrapper").toggleClass("active", false);
  };

  SelectView.prototype.focusSelect = function() {
    return this.$el.parent(".select-wrapper").toggleClass("active", true);
  };

  SelectView.prototype.updateSelectText = function() {
    var newOption;
    newOption = this.$el.find("option:selected").text();
    return this.$el.siblings(".selected-text").text(newOption);
  };

  return SelectView;

})(Backbone.View);

window.CurrencyView = (function(superClass) {
  extend(CurrencyView, superClass);

  function CurrencyView() {
    return CurrencyView.__super__.constructor.apply(this, arguments);
  }

  CurrencyView.prototype.events = {
    'change [name=currencies]': 'convertAll',
    'switch-currency': 'switchCurrency',
    'reset-currency': 'resetCurrency'
  };

  CurrencyView.prototype.initialize = function() {
    this.sectionBinding();
    return this.render();
  };

  CurrencyView.prototype.sectionBinding = function() {
    this.$el.on('shopify:section:load', (function(_this) {
      return function() {
        _this.delegateEvents();
        return _this.render();
      };
    })(this));
    return this.$el.on('shopify:section:unload', (function(_this) {
      return function() {
        return _this.undelegateEvents();
      };
    })(this));
  };

  CurrencyView.prototype.render = function() {
    var $money, doubleMoney, j, l, len, len1, money, ref, ref1;
    Currency.format = Theme.currencySwitcherFormat;
    Currency.money_with_currency_format[Theme.currency] = Theme.moneyFormatCurrency;
    Currency.money_format[Theme.currency] = Theme.moneyFormat;
    this.defaultCurrency = Theme.defaultCurrency || Theme.currency;
    this.cookieCurrency = Currency.cookie.read();
    if (this.cookieCurrency) {
      this.$("[name=currencies]").val(this.cookieCurrency);
    }
    ref = this.$('span.money span.money');
    for (j = 0, len = ref.length; j < len; j++) {
      doubleMoney = ref[j];
      $(doubleMoney).parents('span.money').removeClass('money');
    }
    ref1 = this.$('span.money');
    for (l = 0, len1 = ref1.length; l < len1; l++) {
      money = ref1[l];
      $money = $(money);
      $money.attr("data-currency-" + Theme.currency, $money.html());
    }
    this.switchCurrency();
    return this.$('.selected-currency').text(Currency.currentCurrency);
  };

  CurrencyView.prototype.resetCurrency = function() {
    var attribute, j, l, len, len1, money, ref, ref1, ref2;
    ref = this.$('span.money');
    for (j = 0, len = ref.length; j < len; j++) {
      money = ref[j];
      ref1 = $(money)[0].attributes;
      for (l = 0, len1 = ref1.length; l < len1; l++) {
        attribute = ref1[l];
        if (((ref2 = attribute.name) != null ? ref2.indexOf('data-') : void 0) > -1) {
          $(money).attr(attribute.name, '');
        }
      }
    }
    return this.switchCurrency();
  };

  CurrencyView.prototype.switchCurrency = function() {
    if (this.cookieCurrency === null) {
      if (Theme.currency === !this.defaultCurrency) {
        return Currency.convertAll(Theme.currency, this.defaultCurrency);
      } else {
        return Currency.currentCurrency = this.defaultCurrency;
      }
    } else if (this.$('[name=currencies]').size() && this.$('[name=currencies] option[value=' + this.cookieCurrency + ']').size() === 0) {
      Currency.currentCurrency = Theme.currency;
      return Currency.cookie.write(Theme.currency);
    } else if (this.cookieCurrency === Theme.currency) {
      return Currency.currentCurrency = Theme.currency;
    } else {
      return Currency.convertAll(Theme.currency, this.cookieCurrency);
    }
  };

  CurrencyView.prototype.convertAll = function(e, variant, selector) {
    var newCurrency;
    newCurrency = $(e.target).val();
    Currency.convertAll(Currency.currentCurrency, newCurrency);
    this.$('.selected-currency').text(Currency.currentCurrency);
    return this.cookieCurrency = newCurrency;
  };

  return CurrencyView;

})(Backbone.View);

window.GoalView = (function(superClass) {
  extend(GoalView, superClass);

  function GoalView() {
    return GoalView.__super__.constructor.apply(this, arguments);
  }

  GoalView.prototype.initialize = function() {
    this.$selector = $("[data-goal-countdown]");
    this.endDateTime = this.$selector.data("end-time");
    if (this.$selector.length && this.getRemainingTime().total >= 0) {
      return this.countDownTimer();
    } else {
      return $(document.body).addClass('has-goal-expired');
    }
  };

  GoalView.prototype.getRemainingTime = function() {
    var _day, _hour, _minute, _second, days, hours, minutes, seconds, t;
    _second = 1000;
    _minute = _second * 60;
    _hour = _minute * 60;
    _day = _hour * 24;
    t = Date.parse(this.endDateTime) - Date.parse(new Date());
    seconds = Math.floor((t / _second) % 60);
    minutes = Math.floor((t / _minute) % 60);
    hours = Math.floor((t / _hour) % 24);
    days = Math.floor(t / _day);
    return {
      'total': t,
      'days': days,
      'hours': hours,
      'minutes': minutes,
      'seconds': seconds
    };
  };

  GoalView.prototype.countDownTimer = function() {
    this.$countdownDays = this.$selector.find("[data-goal-countdown-days]");
    this.$countdownHours = this.$selector.find("[data-goal-countdown-hours]");
    this.$countdownMinutes = this.$selector.find("[data-goal-countdown-minutes]");
    this.$countdownSeconds = this.$selector.find("[data-goal-countdown-seconds]");
    this.lastDayText = this.$selector.data("alt-text");
    this.$productViewDays = $(".product-goal-info-days");
    this.$productViewDaysWrapper = $(".product-goal-info-remaining");
    this.runTimer();
    this.timer = setInterval((function(_this) {
      return function() {
        return _this.runTimer();
      };
    })(this), 1000);
    return setTimeout((function(_this) {
      return function() {
        return _this.$el.addClass("active");
      };
    })(this), 100);
  };

  GoalView.prototype.runTimer = function() {
    var timeRemaining;
    timeRemaining = this.getRemainingTime();
    if (timeRemaining.total <= 0) {
      this.$(".module-header-goal-time-up").removeClass("hidden");
      this.$selector.addClass("hidden");
      clearInterval(this.timer);
      return;
    } else {
      this.$countdownDays.html(timeRemaining.days);
      this.$countdownHours.html(timeRemaining.hours);
      this.$countdownMinutes.html(timeRemaining.minutes);
      this.$countdownSeconds.html(timeRemaining.seconds);
    }
    if (this.$productViewDays.length) {
      if (timeRemaining.total > 0 && timeRemaining.days === 0) {
        return this.$productViewDaysWrapper.html(this.lastDayText);
      } else {
        return this.$productViewDays.html(timeRemaining.days);
      }
    }
  };

  return GoalView;

})(Backbone.View);

window.Instagram = (function() {
  function Instagram($el) {
    this.$photoContainer = null;
    this.$errorContainer = null;
    if (!$el.length) {
      return;
    }
    this.init($el);
  }

  Instagram.prototype.init = function($el) {
    var accessToken;
    this.$photoContainer = $el.find('[data-instagram-photos]');
    accessToken = $el.find('[data-instagram-token]').attr('data-instagram-token');
    this.accessTokenError = $el.find('[data-instagram-error]').attr('data-instagram-error');
    if (accessToken.length > 0) {
      return this._getPhotos(accessToken);
    } else {
      return this._hasError(false);
    }
  };

  Instagram.prototype._getPhotos = function(accessToken) {
    var url;
    url = "https://api.instagram.com/v1/users/self/media/recent?access_token=" + accessToken + "&count=6&callback=";
    return $.ajax({
      type: "GET",
      dataType: "jsonp",
      url: url,
      success: (function(_this) {
        return function(response) {
          var j, len, photo, ref, results1;
          if (response.meta.code === 200) {
            _this.$photoContainer.html('');
            ref = response.data;
            results1 = [];
            for (j = 0, len = ref.length; j < len; j++) {
              photo = ref[j];
              results1.push(_this.$photoContainer.append("<a class='instagram-photo' target='_blank' href='" + photo.link + "'><img src='" + photo.images.low_resolution.url + "'/></a>"));
            }
            return results1;
          } else {
            _this._hasError(response);
            return _this._errorOverlay();
          }
        };
      })(this),
      error: (function(_this) {
        return function(response) {
          return _this._hasError(response);
        };
      })(this)
    });
  };

  Instagram.prototype._errorOverlay = function() {
    if (this.$photoContainer.find('[data-instagram-errror]').length) {
      return;
    }
    this.$photoContainer.append("<div class=\"instagram-error\" data-instagram-error>" + this.accessTokenError + "</div>");
    return this.$errorContainer = this.$photoContainer.find('[data-instagram-errror]');
  };

  Instagram.prototype._hasError = function(response) {
    if (response) {
      return console.log("Instagram error: " + response.meta.error_message);
    }
  };

  return Instagram;

})();

Twitter = (function() {
  function Twitter($el) {
    this.$tweetContainer = null;
    this.init($el);
  }

  Twitter.prototype.init = function($el) {
    var retweets, username;
    this.$tweetContainer = $el.find('[data-twitter-tweets]');
    username = $el.find('[data-twitter-username]').attr('data-twitter-username');
    retweets = $el.find('[data-show-retweets]').length;
    return this._fetchTweets(username, retweets);
  };

  Twitter.prototype._fetchTweets = function(username, retweets) {
    var config;
    config = {
      'profile': {
        'screenName': username
      },
      'maxTweets': 1,
      'enableLinks': true,
      'showUser': true,
      'showTime': true,
      'showRetweet': retweets,
      'customCallback': (function(_this) {
        return function(tweets) {
          return _this.renderTweets(tweets);
        };
      })(this),
      'showInteraction': false
    };
    return twitterFetcher.fetch(config);
  };

  Twitter.prototype.renderTweets = function(tweets) {
    this.$tweetContainer.html();
    if (tweets.length) {
      return this.$tweetContainer.html($(tweets[0]));
    } else {
      return console.log("No tweets to display. Most probable cause is an incorrectly entered username.");
    }
  };

  return Twitter;

})();

window.WidgetsView = (function(superClass) {
  extend(WidgetsView, superClass);

  function WidgetsView() {
    return WidgetsView.__super__.constructor.apply(this, arguments);
  }

  WidgetsView.prototype.initialize = function() {
    var $instagram, $twitter;
    $instagram = this.$el.find('[data-widget="instagram"]');
    $twitter = this.$el.find('[data-widget="twitter"]');
    this.instagram = null;
    if ($instagram.length) {
      this.instagram = new Instagram($instagram);
    }
    this.twitter = null;
    if ($twitter.length) {
      return this.twitter = new Twitter($twitter);
    }
  };

  WidgetsView.prototype.update = function($el) {
    var ref;
    this.instagram.init($el);
    return (ref = this.twitter) != null ? ref.init($el) : void 0;
  };

  WidgetsView.prototype.remove = function() {
    delete (this.instagram != null);
    return delete (this.twitter != null);
  };

  return WidgetsView;

})(Backbone.View);

window.ThemeView = (function(superClass) {
  extend(ThemeView, superClass);

  function ThemeView() {
    return ThemeView.__super__.constructor.apply(this, arguments);
  }

  ThemeView.prototype.el = document.body;

  ThemeView.prototype.initialize = function() {
    var body, ref;
    body = $(document.body);
    this.isHome = body.hasClass('template-index');
    this.isCollection = body.hasClass('template-collection');
    this.isListCollections = body.hasClass('template-list-collections');
    this.isProduct = body.hasClass('template-product');
    this.isCart = body.hasClass('template-cart');
    this.isPage = body.hasClass('template-page');
    this.isPassword = body.hasClass('template-password');
    this.isBlog = body.hasClass('template-blog') || body.hasClass('template-article');
    this.isAccount = ((ref = body.attr('class')) != null ? ref.indexOf('-customers-') : void 0) > 0;
    return this.isGiftCardPage = body.hasClass("gift-card-template");
  };

  ThemeView.prototype.render = function() {
    var j, len, ref, rte;
    this._initSections();
    if (!this.isPassword) {
      ref = $('.rte');
      for (j = 0, len = ref.length; j < len; j++) {
        rte = ref[j];
        this.rteView = new RTEView({
          el: rte
        });
      }
    }
    if (this.isHome) {
      this.homeView = new HomeView({
        el: this.$el
      });
      this.homeView.render();
    }
    if (this.isGiftCardPage) {
      this.giftcardView = new GiftCardView({
        el: this.$el
      });
    }
    if (this.isCollection) {
      this.collectionView = new CollectionView({
        el: this.$el
      });
      this.collectionView.render();
    }
    if (this.isListCollections) {
      this.listCollectionsView = new ListCollectionsView({
        el: $('.collections-list')
      });
      this.listCollectionsView.render();
    }
    if (this.isProduct) {
      new ProductView({
        el: this.$el
      });
    }
    if (this.isCart) {
      new CartView({
        el: this.$el
      });
    }
    if (this.isBlog) {
      this.blogView = new BlogView({
        el: this.$el
      });
      this.blogView.render();
    }
    if (this.isAccount) {
      this.accountView = new AccountView({
        el: this.$el
      });
      this.accountView.render();
    }
    if (this.isPage) {
      new PageView({
        el: this.$el
      });
    }
    if (this.isPassword) {
      this.passwordView = new PasswordView({
        el: this.$el
      });
    }
    if (Theme.currencySwitcher) {
      this.currencyView = new CurrencyView({
        el: this.$el
      });
    }
    if ($('html').hasClass('lt-ie10')) {
      this.inputPlaceholderFix();
    }
    if (this.$('select').length && !this.isProduct) {
      return this.$('select').each((function(_this) {
        return function(i, item) {
          return new SelectView({
            el: $(item)
          });
        };
      })(this));
    }
  };

  ThemeView.prototype.inputPlaceholderFix = function() {
    var input, j, len, placeholders, text;
    placeholders = $('[placeholder]');
    for (j = 0, len = placeholders.length; j < len; j++) {
      input = placeholders[j];
      input = $(input);
      if (!(input.val().length > 0)) {
        text = input.attr('placeholder');
        input.attr('value', text);
        input.data('original-text', text);
      }
    }
    placeholders.focus(function() {
      input = $(this);
      if (input.val() === input.data('original-text')) {
        return input.val('');
      }
    });
    return placeholders.blur(function() {
      input = $(this);
      if (input.val().length === 0) {
        return input.val(input.data('original-text'));
      }
    });
  };

  ThemeView.prototype._initSections = function() {
    this.sections = new ThemeEditor();
    this.sections.register('social-feeds', this._socialFeeds(this.sections));
    return this.sections.register('header', this._header(this.sections));
  };

  ThemeView.prototype._socialFeeds = function(sections) {
    return {
      instances: {},
      init: function(instance) {
        return this.instances[instance.sectionId] = new WidgetsView({
          el: instance.$container
        });
      },
      onSectionLoad: function(event) {
        var instance;
        instance = sections.getInstance(event);
        if (this.instances[instance.sectionId] == null) {
          return this.init(instance);
        }
      },
      onSectionDeselect: function(event) {
        var instance, ref;
        instance = sections.getInstance(event);
        return (ref = this.instances[instance.sectionId]) != null ? ref.update(instance.$container) : void 0;
      },
      onSectionUnload: function(event) {
        var instance, ref;
        instance = sections.getInstance(event);
        if ((ref = this.instances[instance.sectionId]) != null) {
          ref.remove();
        }
        return delete this.instances[instance.sectionId];
      }
    };
  };

  ThemeView.prototype._header = function(sections) {
    return {
      instances: {},
      init: function(instance) {
        return this.instances[instance.sectionId] = new HeaderView();
      },
      onSectionLoad: function(event) {
        var instance;
        instance = sections.getInstance(event);
        if (!this.instances[instance.sectionId]) {
          return this.init(instance);
        }
      },
      onSectionUnload: function(event) {
        var instance, ref;
        instance = sections.getInstance(event);
        if ((ref = this.instances[instance.sectionId]) != null) {
          ref.unBindEvents();
        }
        return delete this.instances[instance.sectionId];
      }
    };
  };

  return ThemeView;

})(Backbone.View);

$(function() {
  return window.theme = new ThemeView().render();
});

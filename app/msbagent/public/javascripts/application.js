function ShowHideContent() {
  var self = this;

  self.escapeElementName = function(str) {
    result = str.replace('[', '\\[').replace(']', '\\]')
    return(result);
  };

  self.showHideRadioToggledContent = function () {
    $(".block-label input[type='radio']").each(function () {

      var $radio = $(this);
      var $radioGroupName = $radio.attr('name');
      var $radioLabel = $radio.parent('label');

      var dataTarget = $radioLabel.attr('data-target');

      // Add ARIA attributes

      // If the data-target attribute is defined
      if (dataTarget) {

        // Set aria-controls
        $radio.attr('aria-controls', dataTarget);

        $radio.on('click', function () {

          // Select radio buttons in the same group
          $radio.closest('form').find(".block-label input[name=" + self.escapeElementName($radioGroupName) + "]").each(function () {
            var $this = $(this);

            var groupDataTarget = $this.parent('label').attr('data-target');
            var $groupDataTarget = $('#' + groupDataTarget);

            // Hide toggled content
            $groupDataTarget.hide();
            // Set aria-expanded and aria-hidden for hidden content
            $this.attr('aria-expanded', 'false');
            $groupDataTarget.attr('aria-hidden', 'true');
          });

          var $dataTarget = $('#' + dataTarget);
          $dataTarget.show();
          // Set aria-expanded and aria-hidden for clicked radio
          $radio.attr('aria-expanded', 'true');
          $dataTarget.attr('aria-hidden', 'false');

        });

      } else {
        // If the data-target attribute is undefined for a radio button,
        // hide visible data-target content for radio buttons in the same group

        $radio.on('click', function () {

          // Select radio buttons in the same group
          $(".block-label input[name=" + self.escapeElementName($radioGroupName) + "]").each(function () {

            var groupDataTarget = $(this).parent('label').attr('data-target');
            var $groupDataTarget = $('#' + groupDataTarget);

            // Hide toggled content
            $groupDataTarget.hide();
            // Set aria-expanded and aria-hidden for hidden content
            $(this).attr('aria-expanded', 'false');
            $groupDataTarget.attr('aria-hidden', 'true');
          });

        });
      }

    });
  }
  self.showHideCheckboxToggledContent = function () {

    $(".block-label input[type='checkbox']").each(function() {

      var $checkbox = $(this);
      var $checkboxLabel = $(this).parent();

      var $dataTarget = $checkboxLabel.attr('data-target');

      // Add ARIA attributes

      // If the data-target attribute is defined
      if (typeof $dataTarget !== 'undefined' && $dataTarget !== false) {

        // Set aria-controls
        $checkbox.attr('aria-controls', $dataTarget);

        // Set aria-expanded and aria-hidden
        $checkbox.attr('aria-expanded', 'false');
        $('#'+$dataTarget).attr('aria-hidden', 'true');

        // For checkboxes revealing hidden content
        $checkbox.on('click', function() {

          var state = $(this).attr('aria-expanded') === 'false' ? true : false;

          // Toggle hidden content
          $('#'+$dataTarget).toggle();

          // Update aria-expanded and aria-hidden attributes
          $(this).attr('aria-expanded', state);
          $('#'+$dataTarget).attr('aria-hidden', !state);

        });
      }

    });
  }
}

$(document).ready(function() {

  // Use GOV.UK selection-buttons.js to set selected
  // and focused states for block labels
  var $blockLabels = $(".block-label input[type='radio'], .block-label input[type='checkbox']");
  new GOVUK.SelectionButtons($blockLabels);

  // Show and hide toggled content
  // Where .block-label uses the data-target attribute
  var toggleContent = new ShowHideContent();
  toggleContent.showHideRadioToggledContent();
  toggleContent.showHideCheckboxToggledContent();

});



/*global $*/
// TODO: Tidy up
$(function () {
    // avoids double panel-indented sections
    // should be CSS but isn't possible.
    $('.panel-indent > .form-field--error').parent().css({
        'padding' : 0,
        'border' : 'none'
    });

    // show/hide
    (function () {
     var checkedInputs = 'input[type="checkbox"], input[type="radio"]';

      function showHide($target, value) {
      console.log(""+$($target))
          var $self = $(this),
            $inputs = $target.find('input, option, selected, textarea');

          function pred() {
            var $this = $(this),
              hasValue = false;

            if ($this.is(checkedInputs)) {
              if ($this.prop('checked')) {
                hasValue = true;
              }
            } else if ($this.is('input') && $this.val() !== '') {
              hasValue = true;
            } else if ($this.is('option') && ($this.prop('selected') && $this.val() !== '')) {
              hasValue = true;
            }
            return hasValue;
          }

          if ($inputs.filter(pred).length === 0) {
            if ($self.prop('checked') === false) {
              $target.hide();
            }
          }

          function hide() {
            $inputs.filter(checkedInputs).prop('checked', false);
            $inputs.filter('input, select, textarea').val('');
            $inputs.filter('option').prop('selected', false);
            $target.hide();
          }

          $self.change(function () {
            if ($self.prop('checked') === true) {
              $target.show();
            } else {
              hide();
            }
          });

          $('input[name="' + $self.prop('name') + '"][value!="' + value + '"]').change(function() {
            hide();
          });
      }

      $('*[data-toggle-true]').each(function () {
        var $target = $($(this).data('toggle-true'));
        showHide.call(this, $target, true);
      });

      $('*[data-toggle-false]').each(function () {
        var $target = $($(this).data('toggle-false'));
        showHide.call(this, $target, false);
      });

      $('*[data-toggle-01]').each(function () {
        var $target = $($(this).data('toggle-01')),
            value = $(this).val();
        showHide.call(this, $target, value);
      });

      $('*[data-toggle-02]').each(function () {
        var $target = $($(this).data('toggle-02')),
            value = $(this).val();
        showHide.call(this, $target, value);
      });

      $('*[data-toggle-other]').each(function () {
        var $target = $($(this).data('toggle-other')),
            value = $(this).val();
        showHide.call(this, $target, value);
      });
  })();
});
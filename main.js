// Ryan Dittmer
// Project 4
// VFW 1202
// Add Bill js 

window.addEventListener( "DOMContentLoaded", function(){

	function $( x ){
		var theElement = document.getElementById( x );
		return theElement;
	}
	
	function makeBillTypes(){
		var formTag    = document.getElementsByTagName( "form" ),
			selectLi   = $( 'billtype' ),
			makeSelect = document.createElement( 'select' );
			makeSelect.setAttribute( "id", "billTypes" );
		for( var i = 0, j = billTypes.length; i < j; i++ ){
			var makeOption = document.createElement( 'option' );
			var optText = billTypes[i];
			makeOption.setAttribute( "value", optText );
			makeOption.innerHTML = optText;
			makeSelect.appendChild( makeOption );
		}
		selectLi.appendChild( makeSelect );
	}
	
	function storeData( key )
	{
		if ( !key ) 
		{
			var id     = Math.floor( Math.random() * 10001 );
		}
		else
		{
			id         = key;
		}
		getSelectedRadio();
		var item       = {};
		
		item.billtype  = ["Bill Type:"  , $( 'billTypes' ).value];
		item.payto     = ["Pay To:"     , $( 'payto' ).value];
		item.payamount = ["Pay Amount:" , $( 'payamount' ).value];
		item.paywith   = ["Pay With:"   , paywithValue];
		item.paydate   = ["Pay Date:"   , $( 'paydate' ).value];
		item.notes     = ["Notes"       , $( 'notes' ).value];
		
		localStorage.setItem( id, JSON.stringify( item ) );
		alert( "Bill Added!" );
	}

	function getSelectedRadio()
	{
		var radios = document.forms[0].paytype;
		
		for ( var i = 0; i < radios.length; i++ )
		{
			if ( radios[i].checked )
				paywithValue = radios[i].value;
		}
	}
	
	function getData()
	{
		toggleControls( "on" );
		if( localStorage.length === 0 )
		{
			alert( "You currently have no saved bills. Auto add default bills." );
			autoFillData();
		}
		var makeDiv  = document.createElement( 'div' );
		makeDiv.setAttribute( "id", "items" );
		var makeList = document.createElement( 'ul' );
		makeDiv.appendChild( makeList );
		document.body.appendChild( makeDiv );
		$( 'items' ).style.display = "block";
		for( var i = 0, len = localStorage.length; i < len; i++ )
		{
			var makeli      = document.createElement( 'li' );
			var linksLi     = document.createElement( 'li' );
			makeList.appendChild( makeli );
			var key         = localStorage.key( i );
			var value       = localStorage.getItem( key );
			var obj         = JSON.parse( value );
			var makeSubList = document.createElement( 'ul' );
			makeli.appendChild( makeSubList );
			getImage( obj.billtype[1], makeSubList );
			for( var n in obj )
			{
				var makeSubli       = document.createElement( 'li' );
				makeSubList.appendChild( makeSubli );
				var optSubText      = obj[n][0] + " " + obj[n][1];
				makeSubli.innerHTML = optSubText;
				makeSubList.appendChild( linksLi );
			} 
			makeItemLinks( localStorage.key( i ), linksLi );
		}
	}
	
	function getImage( catName, makeSubList )
	{
		var imageLi = document.createElement( 'li' );
		makeSubList.appendChild( imageLi );
		var newImg  = document.createElement( 'img' );
		var setSrc  = newImg.setAttribute( "src", "img/" + catName + ".png" );
		imageLi.appendChild( newImg );
	}
	
	function autoFillData()
	{
		for ( var n in json )
		{
			var id = Math.floor( Math.random()*10001 );
			localStorage.setItem( id, JSON.stringify( json[n] ) );
		}
	
	}
	
	function makeItemLinks( key, linksLi )
	{
		var editLink         = document.createElement( 'n' );
		editLink.href        = "#";
		editLink.key         = key;
		var editText         = "Edit Bill";
		editLink.addEventListener( "click", editItem );
		editLink.innerHTML   = editText;
		linksLi.appendChild( editLink );
		
		var breakTag         = document.createElement( 'br' );
		linksLi.appendChild( breakTag );
		
		var deleteLink       = document.createElement( 'n' );
		deleteLink.href      = "#";
		deleteLink.key       = key;
		var deleteText       = "Delete Bill";
		deleteLink.addEventListener( "click", deleteItem );
		deleteLink.innerHTML = deleteText;
		linksLi.appendChild( deleteLink );
	}
	
	function editItem()
	{
		var value = localStorage.getItem( this.key );
		var item  = JSON.parse( value );
		
		toggleControls( "off" );
		
		$( 'billTypes' ).value = item.billtype[1];
		$( 'payto' ).value     = item.payto[1];
		$( 'payamount' ).value = item.payamount[1];
		var radios = document.forms[0].paytype;
		for ( var i = 0; i < radios.length; i++ )
		{
			if ( radios[i].value == "Credit Card" && item.paywith[1] == "Credit Card" )
				radios[i].setAttribute( "checked", "checked" );
			else if ( radios[i].value == "Bank Account" && item.paywith[1] == "Bank Account" )
				radios[i].setAttribute( "checked", "checked" );
			else if ( radios[i].value == "Check" && item.paywith[1] == "Check" )
				radios[i].setAttribute( "checked", "checked" );
		}
		$( 'paydate' ).value   = item.paydate[1];
		$( 'notes' ).value     = item.notes[1];
		
		save.removeEventListener( "click", storeData );
		$( 'submit' ).value    = "Edit Bill";
		var editSubmit         = $( 'submit' );
		editSubmit.addEventListener( "click", validate );
		editSubmit.key         = this.key;
	}
	
	function deleteItem()
	{
		var ask = confirm( "Are you sure you want to delete this Bill?" );
		if (ask)
		{
			localStorage.removeItem( this.key );
			window.location.reload();
			alert( "Bill deleted!" );
		}
		else
		{
			alert( "Bill not deleted." );
		}
	}
	
	function validate(e)
	{
		var getBillTypes = $( 'billTypes' );
		var getPayTo     = $( 'payto' );
		var getPayAmount = $( 'payamount' );
		
		errMessage.innerHTML      = "";
		getBillTypes.style.border = "1px solid black";
		getPayTo.style.border     = "1px solid black";
		getPayAmount.style.border = "1px solid black";
		
		var messageArray = [];
		
		if ( getBillTypes.value === "<-Select Bill Type->" )
		{
			var billTypeError         = "Please choose a Bill type.";
			getBillTypes.style.border = "1px solid red";
			messageArray.push( billTypeError );
		}
		
		if ( getPayTo.value === "" )
		{
			var payToError        = "Please enter a Payee.";
			getPayTo.style.border = "1px solid red";
			messageArray.push( payToError );
		}
		
		if ( getPayAmount.value === "" )
		{
			var payAmountError        = "Please enter an amount.";
			getPayAmount.style.border = "1px solid red";
			messageArray.push( payAmountError );
		}
		
		if ( messageArray.length >= 1 )
		{
			for ( var i = 0, j = messageArray.length; i < j; i++ )
			{
				var txt = document.createElement( 'li' );
				txt.innerHTML = messageArray[i];
				errMessage.appendChild( txt );
			}
			e.preventDefault();
			return false;
		}
		else
		{
			storeData( this.key );
		}
	}
	
	function toggleControls( n )
	{
		switch( n )
		{
			case "on":
				$('billForm').style.display    = "none";
				$('clear').style.display       = "inline";
				$('displayData').style.display = "none";
				$('addNew').style.display      = "inline";
				break;
				
			case "off":
				$('billForm').style.display    = "block";
				$('clear').style.display       = "inline";
				$('displayData').style.display = "inline";
				$('addNew').style.display      = "none";
				$('items').style.display       = "none";
				break;
				
			default:
				return false;	
		}
	}
	
	function clearLocal(){
		if( localStorage.length === 0 ){
			alert( "You have no saved bills." );
		}else{
			localStorage.clear();
			alert( "All bills have been deleted!" );
			window.location.reload();
			return false;
		}
	}
	
	var billTypes = [ "<-Select Bill Type->", "Utilities", "Rent-House", "Auto", "Credit-Card", "Other" ];
	var paywithValue;
	var errMessage = $( 'errors' );
	makeBillTypes();
	
	var displayLink = $( 'displayData' );
	displayLink.addEventListener( "click", getData );
	var clearLink   = $( 'clear' );
	clearLink.addEventListener( "click", clearLocal );
	var save        = $( 'submit' );
	save.addEventListener( "click", validate );
	
});
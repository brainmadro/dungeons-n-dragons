const $hamButton = document.querySelector('#menu')
const $navigation = document.querySelector('header nav')

$hamButton.addEventListener('click', () => {
	$navigation.classList.toggle('open');
	$hamButton.classList.toggle('open');
});
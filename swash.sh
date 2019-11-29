echo "Welcome to Swash development"
if [ $# == 0 ]; 
then
	printf "Usage: swash.sh command
	Commands:
		  build  Create an extension package from source
		  test   Run the test units
		  sign   Sign the extension so it can be installed in Firefox
		  run    Run the extension
		  lint   Validate the extension source
		  docs   Open the web-ext documentation in a browser
		  "
	exit
fi

case $1 in	
	test)
	cp environment/test/manifest.json .
	web-ext run --ignore-files "dashboard*" "popup*" "swash.sh" "environment*
	;;
	run)
	mv environment/dev/manifest.json .
	web-ext run --ignore-files "test*" "swash.sh" "environment*
	;;
	* )
	cp environment/production/manifest.json .
	web-ext $1 --ignore-files "swash.sh" "test*" "environment*"
	;;
esac
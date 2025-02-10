#!/bin/bash
#
# cicd_spec_validator
#
# Script to validate a yaml API spec extracted from SwaggerHub
#
# This script uses the SwaggerHub Registry API.
# This script uses the swagger.io validator url
#
# This script is not supported by SmartBear Software and is to be used as-is.
#
#   m. higgins    22/07/2021    inital coding (1.0.0)
#
  
RELEASE="v1.0.0"
API_NAME="cicd_spec_validator"

echo " "
echo "$API_NAME  ${RELEASE} - `date`"

###################################################################################################
# check that jq is installed

if ! jq --help &> /dev/null; then
   echo " "
   echo "The Linux utility jq must be installed to use this script"
   exit 1
fi

###################################################################################################
# read config file

CONFIG_FILE=$HOME/.swaggerhub-bash.cfg

if [ -f $CONFIG_FILE ]; then
   BUFFER=$(jq -r '.' $CONFIG_FILE)
   IS_SAAS=$(echo $BUFFER | jq -r '.is_saas')
   FQDN=$(echo $BUFFER | jq -r '.fqdn')
   REGISTRY_FQDN=$(echo $BUFFER | jq -r '.registry_fqdn')
   MANAGEMENT_FQDN=$(echo $BUFFER | jq -r '.management_fqdn')
   ADMIN_FQDN=$(echo $BUFFER | jq -r '.admin_fqdn')
   API_KEY=$(echo $BUFFER | jq -r '.api_key')
   ADMIN_USERNAME=$(echo $BUFFER | jq -r '.admin_username')
   DEFAULT_ORG=$(echo $BUFFER | jq -r '.default_org')
else
   echo " "
   echo "No Config file found, please run make_swaggerhub_config.sh"
   exit 1
fi

###################################################################################################
# process the command line arguements

if [ $# -ne 3 ]
then
   echo " "
   echo "Incorrect command line arguements."
   echo " "
   echo "usage: cidi_spec_validator <organization> <api> <version>"
   echo " "
   exit 1
fi

ORG=$1
API=$2
VER=$3

FILENAME="_$ORG~$API~$VER.json"

###################################################################################################
# check Organization exist

STRING0=$(curl -sk -X GET "$REGISTRY_FQDN/apis/$ORG"   \
                   -H "accept: application/json"       \
                   -H "Authorization: $API_KEY"        \
                   -H "User-Agent: $API_NAME")

TEST=$(echo $STRING0 | jq '.totalCount')

if [ ${TEST} == null ]; then
   echo " "
   echo "   ERROR: Invalid Organization entered"
   echo " "
   exit 1
fi

###################################################################################################
# check API & Version exist

STRING1=$(curl -sk -X GET "$REGISTRY_FQDN/apis/$ORG/$API/$VER/swagger.json?resolved=false"   \
                   -H "accept: application/json"                                             \
                   -H "Authorization: Bearer $API_KEY"                                       \
                   -H "User-Agent: $API_NAME")

TEST=$(echo $STRING1 | jq '.code')

if [ ${#TEST} -eq 3 ]; then
   echo " "
   echo "   ERROR: API/Version not found."
   echo " "
   exit 1
fi

###################################################################################################
# write the spec to the output file

echo $STRING1 > $FILENAME


###################################################################################################
# get some meta-data

WORK=$(curl -sk -X GET "$REGISTRY_FQDN/apis/$ORG/$API" \
                -H "accept: application/json"          \
                -H "Authorization: Bearer $API_KEY"    \
                -H "User-Agent: $API_NAME")


STRING04=$(echo $WORK | jq -r '.apis[].properties[] | select(.type=="X-Version") | .value')
STRING05=($(echo ${STRING04} | tr "," "\n"))
STRING06=$(echo ${WORK} | jq -r '.apis[].properties[] | select(.type=="X-Created") | .value')
STRING07=($(echo ${STRING06} | tr " " "\n"))
STRING08=$(echo ${WORK} | jq -r '.apis[].properties[] | select(.type=="X-Modified") | .value')
STRING09=($(echo ${STRING08} | tr " " "\n"))
STRING10=$(echo $WORK | jq -r '.apis[].properties[] | select(.type=="X-CreatedBy") | .value')
STRING11=($(echo ${STRING10} | tr " " "\n"))
STRING12=$(echo ${WORK} | jq -r '.apis[].properties[] | select(.type=="X-Specification") | .value')
STRING13=($(echo ${STRING12} | tr " " "\n"))
STRING18=$(echo ${WORK} | jq -r '.apis[].properties[] | select(.type=="X-Version") | .value')
STRING19=($(echo ${STRING18} | tr " " "\n"))

# find this version in the array to get the meta-date

VERSIONCOUNT=${#STRING05[@]}

let i=0

while [ $i -lt $VERSIONCOUNT ]
do

   XVER=${STRING19[$i]}

   if [ $VER == $XVER ]; then
      let k=$i
      break
   fi

   let i=$i+1

done

# grab the meta-data for the correct version

LANGUAGE=${STRING13[$k]}

###################################################################################################
# begin

STRING2=$(curl -sk -X POST "https://validator.swagger.io/validator/debug"  \
                   -H  "accept: application/yaml"                          \
                   -H  "Content-Type: application/json"                    \
                   --data-binary "@"$FILENAME)

###################################################################################################
# cleanup

rm $FILENAME

###################################################################################################
# display the report

TEST=$(echo $STRING2 | grep 'messages: null')

if [ ${#TEST} -eq 0 ]; then
   echo " "
   echo "$STRING2"
   echo " "
   echo "ERROR: Spec is not valid - Exit 1"
   echo " "
   exit 1
else
   echo " "
   echo "INFO: Spec is valid: $LANGUAGE"
   echo " "
fi


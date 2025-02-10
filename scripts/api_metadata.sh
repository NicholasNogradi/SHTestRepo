#!/bin/bash
#
# script to return all the meta-data for an API Version
#
# This script is provided as-is and with no support from SmartBear Software
#
# m. higgins    03/07/2024    initial coding (1.0.0)

API_NAME="api_metadata"
RELEASE="v1.0.0"

# ooutput of the script needs to be native json - no other echo data
#echo " "
#echo "$API_NAME  ${RELEASE} - `date`"

######################################################################################################
# check that jq is installed

if ! jq --help &> /dev/null; then
   echo " "
   echo "The Linux utility jq must be installed to use this script"
   echo " "
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

if [ $IS_SAAS == "false" ]; then
   IDX=5
else
   IDX=4
fi

######################################################################################################
# process command line arguements

if [ "$#" -ne 3 ]; then
   echo " "
   echo "You must specify the <Organization> <api> <version> on the command line"
   echo " "
   exit 3
fi

ORG=$1
API=$2
VER=$3

######################################################################################################
# make sure the Source org exist

TEST=$(curl -sk -X GET "$REGISTRY_FQDN/apis/$ORG"   \
                -H "accept: application/json"       \
                -H "Authorization: $API_KEY"        \
                -H "User-Agent: $API_NAME"          \
       | jq '.totalCount')                                                                          

if [ ${TEST} == null ]; then
   echo " "
   echo "ERROR: Bad SOURCE Organization entered"
   exit 1
fi
 
###################################################################################################
# check the API/Verion exists

STRING1=$(curl -sk -X GET "$REGISTRY_FQDN/apis/$ORG/$API/$VER/swagger.json" \
                   -H "accept: application/json"                            \
                   -H "User-Agent: $API_NAME"                               \
                   -H "Authorization: Bearer $API_KEY")

TEST=$(echo $STRING1 | jq '.info')

if [ ${#TEST} -lt 10 ]; then
   echo " "
   echo "API/Version not found."
   exit 1
fi

###################################################################################################
# build the project lookup array

declare -A PROJ_ARRAY

PWORK=$(curl -sk -X GET "$REGISTRY_FQDN/projects/$ORG?nameOnly=false&page=0&limit=100&order=ASC" \
     -H 'accept: application/json'                                                               \
     -H "Authorization: Bearer $API_KEY"                                                         \
     -H "User-Agent: $API_NAME")

readarray -t PARR < <(echo $PWORK | jq -r '.projects[].name')

for PROJ in "${PARR[@]}"; do

   # process APIS

   declare -a APIARR=($(echo "$PWORK" | \
                       jq -r --arg PROJ "$PROJ" '.projects[] | select(.name==$PROJ) | .apis[]'))

   for xAPI in "${APIARR[@]}"; do
      PROJ_ARRAY[$xAPI]+="$PROJ~"
   done

done

# remove trailing tilda

for key in "${!PROJ_ARRAY[@]}"; do

   PROJ_ARRAY[$key]=$(echo ${PROJ_ARRAY[$key]} | sed 's/\(.*\)~/\1/')

done

######################################################################################################
# begin

DEF=$(curl -sk -X GET "$REGISTRY_FQDN/apis/$ORG/$API/settings/default" \
               -H "accept: application/json"                           \
               -H "Authorization: Bearer $API_KEY"                     \
               -H "User-Agent: $API_NAME"                              \
      | jq -r '.version')


# Versions loop

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
CREATED=${STRING07[$k]}
MODIFIED=${STRING09[$k]}
BY=${STRING11[$k]}

# BUG: the BY string can be null because the Property is not returned in the payload

length=${#BY}  

if [ $length -lt 1 ]; then
   BY="<no data>"
fi

# find the API level meta-data attributes - Public / Published

ISPRIVATE=$(curl -sk -X GET "$REGISTRY_FQDN/apis/$ORG/$API/$VER/settings/private"  \
                     -H "accept: application/json"                                 \
                     -H "Authorization: Bearer $API_KEY"                           \
                     -H "User-Agent: $API_NAME"                                    \
              | jq '.private')

ISPUBLISHED=$(curl -sk -X GET "$REGISTRY_FQDN/apis/$ORG/$API/$VER/settings/lifecycle" \
                       -H "accept: application/json"                                  \
                       -H "Authorization: Bearer $API_KEY"                            \
                       -H "User-Agent: $API_NAME"                                     \
                       | jq '.published')

# create the meta data

ISDEF="false"
if [ $DEF == $VER ];then
   ISDEF="true"
fi

PROJECTS=$(echo "${PROJ_ARRAY[$API]}" | tr '~' ',')

if [ ${#PROJECTS} -lt 1  ]; then
   PROJECTS="---"
fi

dtag=`date +%Y-%m-%d`

echo "{"
echo "  \"type\":          \"api\","
echo "  \"organization\":  \"$ORG\","
echo "  \"name\":          \"$API\","
echo "  \"version\":       \"$VER\","
echo "  \"language\":      \"$LANGUAGE\","
echo "  \"author\":        \"$BY\","
echo "  \"created-date\":  \"$CREATED\","
echo "  \"modified-date\": \"$MODIFIED\","
echo "  \"projects\":      \"$PROJECTS\","
echo "  \"is_default\":    \"$ISDEF\","
echo "  \"is_private\":    \"$ISPRIVATE\","
echo "  \"is_published\":  \"$ISPUBLISHED\","
echo "  \"timestamp\":     \"$dtag\""
echo "}"

exit

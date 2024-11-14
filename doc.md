Signup ✅
1. Zod validations
2. Run eval script to check and add user to data
3. return if user already exists
4. send data to kakfa Queue to store in DB
5. We directly send successful msg even we dont done DB operations
6. Generate token


Signin ✅
1. Zod validation
2. check user in cache
3. password validation
4. check in Db if not in cache
4. Generate token

Create a Space ✅
1. ZOD
2. Check in cache mapID Avalible
4. Add in cache (MapID, SpaceID Both)
5. Send in kafka queue

Delete a Space ✅
1. ZOD
2. Check in cache mapID Avalible
3. Delete it
4. Send in kafka queue

getAllSpace ✅
1. ZOD
2. Check in caches
3. Check in DB
4. Add in cache (SpaceID)

getSpecificSpace
addElement 
deleteElement
getAllElements


addElement ✅
updateElement ✅
addAvatar ✅
addMap ✅



=> How to query Data



Let's done some calcualtions
1. For accesing elements data of Any Map
take avg 500 elements on every map
avg 200 elements each elements
200 * 500 = 100KB Data (Approx.)
suppose have total 10k maps as userbase 
just need 10k * 100KB = 1 GB storage (It's easily works with single redis(replication too))



Desing Kafka
1. Topics => users....
2. Users => partition0 as AddUser




Tomorrow Tasks
- [ ] 4 left functions ( half hrs)
- [ ] currently make fake URL service ( 1 hrs)
- [ ] DB server (2 hrs)
- [ ] Setup Infra
    - [ ] Redis (half hr)
    - [ ] PS (half hr)
    - [ ] Kafka (1 hr)
    - [ ] k8s (3 hr)
- [ ] Monitoring and loggings (5 hrs)



DBserver
1. DBManager Lots of connection of DBs + Kafka Consumer
2. Filter out request from Kafka
3. DB table push, if it's first time
4. Conrollers for each topics and partition
Slingshot.fileRestrictions( "uploadToAmazonS3", {
  allowedFileTypes: [ "image/png", "image/jpeg" ],
  maxSize: 1 * 1024 * 1024
})

Slingshot.createDirective( "uploadToAmazonS3", Slingshot.S3Storage, {
  bucket: "apolloserver-logos",
  acl: "public-read",
  authorize: function () {
    // do some validation
    // e.g. deny uploads if user is not logged in.
    if (!this.userId) {
      throw new Meteor.Error(403, "Login Required");
     }

    return true;
  },
  key: function ( file ) {
    return this.userId + '/' + file.name
  }
})

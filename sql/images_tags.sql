CREATE TABLE [dbo].[images_tags] (
    [id]                NVARCHAR (255)     CONSTRAINT [DF_images_tags_id] DEFAULT (CONVERT([nvarchar](255),newid(),(0))) NOT NULL,
    [createdAt]         DATETIMEOFFSET (7) CONSTRAINT [DF_images_tags_createdAt] DEFAULT (CONVERT([datetimeoffset](7),sysutcdatetime(),(0))) NOT NULL,
    [updatedAt]         DATETIMEOFFSET (7) NULL,
    [version]           ROWVERSION         NOT NULL,
    [deleted]           BIT                DEFAULT ((0)) NULL,
    [imagesId]           NVARCHAR (255)     NULL,
    [tagsId]         		NVARCHAR (255)     NULL,
    PRIMARY KEY NONCLUSTERED ([id] ASC), 
	CONSTRAINT [AK_images_tags] UNIQUE ([imagesId], [tagsId]),
    CONSTRAINT [FK_images_tags_images] FOREIGN KEY ([imagesId]) REFERENCES [images]([id]),  
	CONSTRAINT [FK_images_tags_tags] FOREIGN KEY ([tagsId]) REFERENCES [tags]([id])  
);




GO
CREATE CLUSTERED INDEX [createdAt]
    ON [dbo].[images_tags]([createdAt] ASC);


GO
CREATE TRIGGER [TR_images_tags_InsertUpdateDelete] ON [dbo].[images_tags]
		   AFTER INSERT, UPDATE, DELETE
		AS
		BEGIN
			SET NOCOUNT ON;
			IF TRIGGER_NESTLEVEL() > 3 RETURN;

			UPDATE [dbo].[images_tags] SET [dbo].[images_tags].[updatedAt] = CONVERT (DATETIMEOFFSET(7), SYSUTCDATETIME())
			FROM INSERTED
			WHERE INSERTED.id = [dbo].[images_tags].[id]
		END
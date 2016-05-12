CREATE TABLE [dbo].[images] (
    [id]                NVARCHAR (255)     CONSTRAINT [DF_images_id] DEFAULT (CONVERT([nvarchar](255),newid(),(0))) NOT NULL,
    [createdAt]         DATETIMEOFFSET (7) CONSTRAINT [DF_images_createdAt] DEFAULT (CONVERT([datetimeoffset](7),sysutcdatetime(),(0))) NOT NULL,
    [updatedAt]         DATETIMEOFFSET (7) NULL,
    [version]           ROWVERSION         NOT NULL,
    [deleted]           BIT                DEFAULT ((0)) NULL,
    [imageUrl]          NVARCHAR (MAX)     NULL,
    [title]         		NVARCHAR (100)     NULL,
    [usersId]          NVARCHAR (255)     NULL,
    PRIMARY KEY NONCLUSTERED ([id] ASC), 
    CONSTRAINT [FK_images_users] FOREIGN KEY ([usersId]) REFERENCES [users]([id]),  
);




GO
CREATE CLUSTERED INDEX [createdAt]
    ON [dbo].[images]([createdAt] ASC);


GO
CREATE TRIGGER [TR_images_InsertUpdateDelete] ON [dbo].[images]
		   AFTER INSERT, UPDATE, DELETE
		AS
		BEGIN
			SET NOCOUNT ON;
			IF TRIGGER_NESTLEVEL() > 3 RETURN;

			UPDATE [dbo].[images] SET [dbo].[images].[updatedAt] = CONVERT (DATETIMEOFFSET(7), SYSUTCDATETIME())
			FROM INSERTED
			WHERE INSERTED.id = [dbo].[images].[id]
		END